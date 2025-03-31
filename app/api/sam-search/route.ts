import { NextResponse } from "next/server";
import {
  searchSamEntities,
  initializeIndices,
} from "../../../utils/samCsvParser";

export async function GET(request: Request) {
  try {
    // Initialize indices if needed
    await initializeIndices();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const state = searchParams.get("state");
    const capabilities = searchParams.getAll("capabilities");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const filters = {
      state: state || undefined,
      capabilities: capabilities.length > 0 ? capabilities : undefined,
    };

    const results = await searchSamEntities(query, filters);

    // Check for special status results
    if (results.length === 1 && results[0].ueiSAM === "LOADING") {
      return NextResponse.json(
        {
          message: "Data is still loading. Please try again in a moment.",
          isLoading: true,
        },
        { status: 202 }
      );
    }

    if (results.length === 1 && results[0].ueiSAM === "ERROR") {
      return NextResponse.json(
        {
          error: "Failed to load SAM data. Please check server logs.",
          isError: true,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
