"use client";

import { useState } from "react";
import { useSamSearch } from "../hooks/useSamSearch";
import UserPreferences from "../components/UserPreferences";

export default function Home() {
  const {
    query,
    setQuery,
    results,
    totalRecords,
    loading,
    error,
    isInitializing,
  } = useSamSearch();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Government Contractor Search</h1>

      <UserPreferences />

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for government contractors..."
          className="w-full p-3 border rounded-md"
        />
      </div>

      {isInitializing && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600 mb-2">Initializing SAM data...</p>
          <p className="text-gray-500">
            This may take a minute as we process the large dataset.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}

      {loading && !isInitializing && (
        <p className="text-gray-600">Searching...</p>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && !isInitializing && results.length > 0 && (
        <div>
          <p className="text-gray-600 mb-4">
            Found {totalRecords} results. Showing {results.length}.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {results.map((entity) => (
              <div
                key={entity.ueiSAM}
                className="border rounded-md p-4 bg-white shadow-sm"
              >
                <h2 className="text-xl font-semibold">
                  {entity.legalBusinessName}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  UEI: {entity.ueiSAM}
                </p>

                {entity.physicalAddress && (
                  <div className="text-sm">
                    <p>{entity.physicalAddress.addressLine1}</p>
                    <p>
                      {entity.physicalAddress.city},{" "}
                      {entity.physicalAddress.stateOrProvinceCode}{" "}
                      {entity.physicalAddress.zipCode}
                    </p>
                  </div>
                )}

                {entity.capabilities && entity.capabilities.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-sm font-medium">Capabilities:</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entity.capabilities.slice(0, 5).map((cap, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {cap}
                        </span>
                      ))}
                      {entity.capabilities.length > 5 && (
                        <span className="text-xs text-gray-500">
                          +{entity.capabilities.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        !isInitializing &&
        query &&
        results.length === 0 && (
          <p className="text-gray-600">
            No results found. Try a different search term.
          </p>
        )}
    </div>
  );
}
