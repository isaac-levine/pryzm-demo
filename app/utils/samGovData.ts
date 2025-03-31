export interface SamEntity {
  entityId: string;
  duns: string;
  legalBusinessName: string;
  dbaName: string;
  entityStructure: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateOrProvinceCode: string;
  zipCode: string;
  countryCode: string;
  website: string;
  registrationStatus: string;
}

// Cache for improved performance
let entityCache: SamEntity[] = [];
const CACHE_SIZE = 1000; // Limit cache size to prevent memory issues

/**
 * Search for entities in the SAM.gov data file via the API
 */
export async function searchEntities(query: string): Promise<SamEntity[]> {
  query = query.toLowerCase().trim();

  // Quick return for empty queries
  if (!query) return [];

  // Check cache first
  const cachedResults = entityCache.filter(
    (entity) =>
      entity.legalBusinessName.toLowerCase().includes(query) ||
      entity.dbaName.toLowerCase().includes(query) ||
      entity.website.toLowerCase().includes(query)
  );

  if (cachedResults.length > 0) {
    return cachedResults;
  }

  try {
    // Try the real API first
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (!data.error) {
          const results = data.results;
          updateCache(results);
          return results;
        }
      }

      // If the real API fails, fall back to the mock API
      throw new Error("Using mock data fallback");
    } catch (primaryError) {
      console.log("Falling back to mock data:", primaryError);

      // Fallback to mock data
      const mockResponse = await fetch(
        `/api/mock-search?q=${encodeURIComponent(query)}`
      );

      if (!mockResponse.ok) {
        throw new Error(
          `Mock search failed with status: ${mockResponse.status}`
        );
      }

      const mockData = await mockResponse.json();
      const results = mockData.results;

      // Update cache with mock results
      updateCache(results);

      return results;
    }
  } catch (error) {
    console.error("Error searching entities:", error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
}

/**
 * Update the entity cache
 */
function updateCache(entities: SamEntity[]): void {
  // Add new entities to cache
  entityCache = [...entities, ...entityCache];

  // Trim cache if it exceeds the maximum size
  if (entityCache.length > CACHE_SIZE) {
    entityCache = entityCache.slice(0, CACHE_SIZE);
  }
}

/**
 * Filter entities based on criteria
 */
export function filterEntities(
  entities: SamEntity[],
  filters: {
    entityType?: string[];
    state?: string[];
    registrationStatus?: string[];
  }
): SamEntity[] {
  return entities.filter((entity) => {
    if (
      filters.entityType &&
      filters.entityType.length > 0 &&
      !filters.entityType.includes(entity.entityStructure)
    ) {
      return false;
    }
    if (
      filters.state &&
      filters.state.length > 0 &&
      !filters.state.includes(entity.stateOrProvinceCode)
    ) {
      return false;
    }
    if (
      filters.registrationStatus &&
      filters.registrationStatus.length > 0 &&
      !filters.registrationStatus.includes(entity.registrationStatus)
    ) {
      return false;
    }
    return true;
  });
}
