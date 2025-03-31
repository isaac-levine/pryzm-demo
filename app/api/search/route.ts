import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { createReadStream } from "fs";
import readline from "readline";

interface SamEntity {
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

// Parse a line from the SAM.gov data file
function parseSamEntityLine(line: string): SamEntity | null {
  if (!line.startsWith("C111")) return null;

  const fields = line.split("|");

  // Basic validation to ensure we have enough fields
  if (fields.length < 30) return null;

  return {
    entityId: fields[1] || "",
    duns: fields[2] || "",
    legalBusinessName: fields[10] || "",
    dbaName: fields[11] || "",
    entityStructure: fields[20]?.split("~")[0] || "",
    addressLine1: fields[16] || "",
    addressLine2: fields[17] || "",
    city: fields[18] || "",
    stateOrProvinceCode: fields[19] || "",
    zipCode: fields[20] || "",
    countryCode: fields[22] || "",
    website: fields[25] || "",
    registrationStatus: fields[5] || "",
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results: SamEntity[] = [];
  const dataFilePath = path.join(
    process.cwd(),
    "public",
    "SAM_PUBLIC_UTF-8_MONTHLY_V2_20250302.dat"
  );

  if (!fs.existsSync(dataFilePath)) {
    return NextResponse.json(
      { error: "SAM.gov data file not found" },
      { status: 404 }
    );
  }

  try {
    const fileStream = createReadStream(dataFilePath, { encoding: "utf8" });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      // Skip the header line
      if (line.startsWith("BOF")) continue;

      const entity = parseSamEntityLine(line);
      if (!entity) continue;

      const legalNameMatch = entity.legalBusinessName
        .toLowerCase()
        .includes(query);
      const dbaNameMatch = entity.dbaName.toLowerCase().includes(query);
      const websiteMatch = entity.website.toLowerCase().includes(query);

      if (legalNameMatch || dbaNameMatch || websiteMatch) {
        results.push(entity);

        // Limit results to 100 for performance
        if (results.length >= 100) break;
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching SAM.gov data:", error);
    return NextResponse.json(
      { error: "Failed to search SAM.gov data" },
      { status: 500 }
    );
  }
}
