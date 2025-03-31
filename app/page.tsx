"use client";

import Sidebar from "./components/Sidebar";
import { useSamGovData } from "./hooks/useSamGovData";

export default function Home() {
  const { filteredResults, loading, error, lastSearch } = useSamGovData();

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 border-x border-gray-800">
        <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold">SAM.gov Search</h1>
          {lastSearch && (
            <p className="text-sm text-gray-400 mt-1">
              Showing results for "{lastSearch}"
            </p>
          )}
        </header>

        <main className="p-4">
          {error && (
            <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <p className="text-xl text-gray-400 mb-2">No results found</p>
              <p className="text-gray-500">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((entity) => (
                <article
                  key={entity.entityId}
                  className="p-4 hover:bg-gray-900/50 transition-colors border-b border-gray-800"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">
                        {entity.legalBusinessName}
                      </h2>
                      {entity.dbaName && (
                        <span className="text-gray-400 text-sm">
                          @{entity.dbaName}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {entity.entityStructure}
                    </p>
                    <div className="text-gray-300">
                      <p>{entity.address.addressLine1}</p>
                      <p className="text-gray-400">
                        {entity.address.city},{" "}
                        {entity.address.stateOrProvinceCode}{" "}
                        {entity.address.zipCode}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
