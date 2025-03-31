import axios from "axios";

const SAM_GOV_API_KEY = process.env.SAMGOV_API_KEY;
const BASE_URL = "https://api.sam.gov/data-services/v1/";

export interface EntitySearchResult {
  entityId: string;
  legalBusinessName: string;
  dbaName?: string;
  entityStructure: string;
  address: {
    addressLine1: string;
    city: string;
    stateOrProvinceCode: string;
    zipCode: string;
  };
}

export async function searchEntities(
  query: string
): Promise<EntitySearchResult[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}entity-information/v3/entities`,
      {
        params: {
          api_key: SAM_GOV_API_KEY,
          legalBusinessName: query,
          includeSections: "entityRegistration",
        },
      }
    );

    return response.data.entityData || [];
  } catch (error) {
    console.error("Error searching SAM.gov:", error);
    throw error;
  }
}
