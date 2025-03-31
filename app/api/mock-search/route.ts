import { NextRequest, NextResponse } from "next/server";
import type { SamEntity } from "@/app/utils/samGovData";

// Sample data to use when the real data file isn't available
const mockData: SamEntity[] = [
  {
    entityId: "C111ATT311C8",
    duns: "53YC5",
    legalBusinessName: "K & K CONSTRUCTION SUPPLY INC",
    dbaName: "",
    entityStructure: "2L",
    addressLine1: "11400 WHITE ROCK RD",
    addressLine2: "",
    city: "RANCHO CORDOVA",
    stateOrProvinceCode: "CA",
    zipCode: "95742",
    countryCode: "USA",
    website: "www.kkconstructionsupply.com",
    registrationStatus: "A",
  },
  {
    entityId: "C111BG66D155",
    duns: "6M9A6",
    legalBusinessName: "NEW ADVANCES FOR PEOPLE WITH DISABILITIES",
    dbaName: "NAPD",
    entityStructure: "8H",
    addressLine1: "3400 N SILLECT AVE",
    addressLine2: "",
    city: "BAKERSFIELD",
    stateOrProvinceCode: "CA",
    zipCode: "93308",
    countryCode: "USA",
    website: "www.napd-bak.org",
    registrationStatus: "A",
  },
  {
    entityId: "C111FE1KRJF1",
    duns: "6T4Q4",
    legalBusinessName: "RIDE ON ST. LOUIS, INC.",
    dbaName: "",
    entityStructure: "8H",
    addressLine1: "5 N LAKE DR",
    addressLine2: "",
    city: "HILLSBORO",
    stateOrProvinceCode: "MO",
    zipCode: "63050",
    countryCode: "USA",
    website: "www.rideonstl.org",
    registrationStatus: "A",
  },
  {
    entityId: "C111FE1ABCD2",
    duns: "7T4Q5",
    legalBusinessName: "TECH INNOVATIONS LLC",
    dbaName: "TechInno",
    entityStructure: "2L",
    addressLine1: "123 TECH BOULEVARD",
    addressLine2: "SUITE 400",
    city: "SAN FRANCISCO",
    stateOrProvinceCode: "CA",
    zipCode: "94107",
    countryCode: "USA",
    website: "www.techinnovations.com",
    registrationStatus: "A",
  },
  {
    entityId: "C111FE1EFGH3",
    duns: "8T4Q6",
    legalBusinessName: "HEALTHCARE PARTNERS INC",
    dbaName: "HC Partners",
    entityStructure: "CJ",
    addressLine1: "456 MEDICAL CENTER DR",
    addressLine2: "",
    city: "BOSTON",
    stateOrProvinceCode: "MA",
    zipCode: "02115",
    countryCode: "USA",
    website: "www.healthcarepartners.org",
    registrationStatus: "A",
  },
  {
    entityId: "C111FE1IJKL4",
    duns: "9T4Q7",
    legalBusinessName: "CONSTRUCTION EXPERTS CORP",
    dbaName: "ConEx",
    entityStructure: "2X",
    addressLine1: "789 BUILDER WAY",
    addressLine2: "",
    city: "DALLAS",
    stateOrProvinceCode: "TX",
    zipCode: "75201",
    countryCode: "USA",
    website: "www.constructionexperts.com",
    registrationStatus: "A",
  },
  {
    entityId: "C111FE1MNOP5",
    duns: "0T4Q8",
    legalBusinessName: "CONSULTING SERVICES GROUP",
    dbaName: "CSG",
    entityStructure: "2L",
    addressLine1: "321 ADVISOR STREET",
    addressLine2: "FLOOR 15",
    city: "CHICAGO",
    stateOrProvinceCode: "IL",
    zipCode: "60601",
    countryCode: "USA",
    website: "www.consultingservicesgroup.com",
    registrationStatus: "A",
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // Filter mock data based on the query
  const results = mockData.filter(
    (entity) =>
      entity.legalBusinessName.toLowerCase().includes(query) ||
      entity.dbaName.toLowerCase().includes(query) ||
      entity.website.toLowerCase().includes(query) ||
      entity.city.toLowerCase().includes(query) ||
      entity.stateOrProvinceCode.toLowerCase().includes(query)
  );

  // Add a short delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({ results });
}
