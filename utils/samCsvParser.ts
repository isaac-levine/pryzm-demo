import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export interface SamEntity {
  ueiSAM: string;
  legalBusinessName: string;
  physicalAddress?: {
    addressLine1?: string;
    city?: string;
    stateOrProvinceCode?: string;
    zipCode?: string;
    countryCode?: string;
  };
  capabilities?: string[];
  registrationStatus?: string;
}

const SAM_CSV_PATH = path.join(
  process.cwd(),
  "public",
  "SAM_PUBLIC_UTF8_MONTHLY_V2_20250302.dat"
);

// Cache the parsed data to avoid reading the file multiple times
let entityIndex: Map<string, SamEntity> = new Map();
// For search functionality
let nameIndex: Map<string, string[]> = new Map(); // Maps lowercase words to UEI IDs
let stateIndex: Map<string, string[]> = new Map(); // Maps states to UEI IDs
let capabilityIndex: Map<string, string[]> = new Map(); // Maps capabilities to UEI IDs

let isInitialized = false;
let isInitializing = false;

export async function initializeIndices(): Promise<void> {
  if (isInitialized || isInitializing) return;

  isInitializing = true;
  console.log("Initializing SAM entity indices...");

  try {
    // Check if file exists
    if (!fs.existsSync(SAM_CSV_PATH)) {
      console.error("SAM CSV file not found at:", SAM_CSV_PATH);
      isInitializing = false;
      return;
    }

    // Read the file content as string
    const fileContent = fs.readFileSync(SAM_CSV_PATH, "utf8");

    // Use csv-parse/sync for synchronous parsing
    const records = parse(fileContent, {
      delimiter: ",",
      columns: true,
      skip_empty_lines: true,
      from_line: 1,
      to_line: 5000, // Only load a limited number of records initially
    });

    // Process each record
    let count = 0;
    for (const record of records) {
      const entity: SamEntity = {
        ueiSAM: record.UNIQUE_ENTITY_ID || "",
        legalBusinessName: record.LEGAL_BUSINESS_NAME || "",
        physicalAddress: {
          addressLine1: record.PHYSICAL_ADDRESS_LINE_1 || "",
          city: record.PHYSICAL_ADDRESS_CITY || "",
          stateOrProvinceCode:
            record.PHYSICAL_ADDRESS_STATE_OR_PROVINCE_CODE || "",
          zipCode: record.PHYSICAL_ADDRESS_ZIP_CODE || "",
          countryCode: record.PHYSICAL_ADDRESS_COUNTRY_CODE || "",
        },
        capabilities: record.CAPABILITY_NARRATIVE
          ? record.CAPABILITY_NARRATIVE.split(";").map((s: string) => s.trim())
          : [],
        registrationStatus: record.REGISTRATION_STATUS || "",
      };

      // Add to main index
      entityIndex.set(entity.ueiSAM, entity);

      // Index by name words
      const nameWords = entity.legalBusinessName.toLowerCase().split(/\W+/);
      nameWords.forEach((word) => {
        if (word.length > 2) {
          // Skip small words
          const existing = nameIndex.get(word) || [];
          nameIndex.set(word, [...existing, entity.ueiSAM]);
        }
      });

      // Index by state
      if (entity.physicalAddress?.stateOrProvinceCode) {
        const state = entity.physicalAddress.stateOrProvinceCode.toLowerCase();
        const existing = stateIndex.get(state) || [];
        stateIndex.set(state, [...existing, entity.ueiSAM]);
      }

      // Index by capabilities
      entity.capabilities?.forEach((cap) => {
        const capWords = cap.toLowerCase().split(/\W+/);
        capWords.forEach((word) => {
          if (word.length > 2) {
            const existing = capabilityIndex.get(word) || [];
            capabilityIndex.set(word, [...existing, entity.ueiSAM]);
          }
        });
      });

      count++;
      if (count % 1000 === 0) {
        console.log(`Processed ${count} entities...`);
      }
    }

    console.log(`Finished initializing indices with ${count} entities.`);
    isInitialized = true;
  } catch (error) {
    console.error("Error initializing SAM entity indices:", error);
  } finally {
    isInitializing = false;
  }
}

// Make sure to export this function!
export async function searchSamEntities(
  query: string,
  filters: { state?: string; capabilities?: string[] } = {}
): Promise<SamEntity[]> {
  // Initialize indices if not already done
  if (!isInitialized) {
    try {
      await initializeIndices();
    } catch (err) {
      console.error("Error initializing indices:", err);
      return [];
    }
  }

  // Handle case where indices couldn't be initialized
  if (!isInitialized && !isInitializing) {
    return [
      {
        ueiSAM: "ERROR",
        legalBusinessName:
          "SAM data could not be loaded. Please check server logs.",
      },
    ];
  }

  // While indices are initializing, return a loading message
  if (isInitializing) {
    return [
      {
        ueiSAM: "LOADING",
        legalBusinessName: "Loading SAM data. Please wait...",
      },
    ];
  }

  // Normalize query
  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\W+/).filter((w) => w.length > 2);

  // Get candidate UIDs from name index
  const candidateIds = new Set<string>();
  queryWords.forEach((word) => {
    const matchingIds = nameIndex.get(word) || [];
    matchingIds.forEach((id) => candidateIds.add(id));
  });

  // Filter by state if provided
  if (filters.state) {
    const stateIds = stateIndex.get(filters.state.toLowerCase()) || [];
    const stateIdSet = new Set(stateIds);

    // If we have query words, intersect with the existing candidates
    if (candidateIds.size > 0) {
      const intersection = new Set<string>();
      candidateIds.forEach((id) => {
        if (stateIdSet.has(id)) {
          intersection.add(id);
        }
      });
      candidateIds.clear();
      intersection.forEach((id) => candidateIds.add(id));
    } else {
      // If no query words, just use all IDs from the state
      stateIds.forEach((id) => candidateIds.add(id));
    }
  }

  // Filter by capabilities if provided
  if (filters.capabilities && filters.capabilities.length > 0) {
    const capWords = new Set<string>();
    filters.capabilities.forEach((cap) => {
      cap
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 2)
        .forEach((w) => capWords.add(w));
    });

    const capIds = new Set<string>();
    capWords.forEach((word) => {
      const matchingIds = capabilityIndex.get(word) || [];
      matchingIds.forEach((id) => capIds.add(id));
    });

    // If we have existing candidates, intersect with capability IDs
    if (candidateIds.size > 0) {
      const intersection = new Set<string>();
      candidateIds.forEach((id) => {
        if (capIds.has(id)) {
          intersection.add(id);
        }
      });
      candidateIds.clear();
      intersection.forEach((id) => candidateIds.add(id));
    } else {
      // If no existing candidates, just use all capability IDs
      capIds.forEach((id) => candidateIds.add(id));
    }
  }

  // If no candidates found but we have a query, try a more lenient search
  if (candidateIds.size === 0 && queryWords.length > 0) {
    // Try partial matches
    Array.from(nameIndex.keys()).forEach((indexedWord) => {
      if (queryWords.some((qword) => indexedWord.includes(qword))) {
        const matchingIds = nameIndex.get(indexedWord) || [];
        matchingIds.forEach((id) => candidateIds.add(id));
      }
    });
  }

  // Convert candidate IDs to entities
  const results: SamEntity[] = Array.from(candidateIds)
    .map((id) => entityIndex.get(id)!)
    .filter(Boolean);

  // Sort results by relevance (simple implementation)
  results.sort((a, b) => {
    // Prioritize exact name matches
    const aNameMatch = a.legalBusinessName
      .toLowerCase()
      .includes(normalizedQuery);
    const bNameMatch = b.legalBusinessName
      .toLowerCase()
      .includes(normalizedQuery);

    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;

    // Alphabetical as fallback
    return a.legalBusinessName.localeCompare(b.legalBusinessName);
  });

  // Limit to top 50 results
  return results.slice(0, 50);
}

// Initialize indices immediately when module is imported
initializeIndices().catch((err) =>
  console.error("Failed to initialize indices:", err)
);
