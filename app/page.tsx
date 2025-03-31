"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { useSamGovData } from "./hooks/useSamGovData";
import WelcomeScreen from "./components/WelcomeScreen";
import { SamEntity } from "./utils/samGovData";

export default function Home() {
  const { filteredResults, loading, error, lastSearch, results, handleSearch } =
    useSamGovData();

  const [showWelcome, setShowWelcome] = useState(true);
  const [trending, setTrending] = useState<string[]>([
    "Construction",
    "Healthcare",
    "Technology",
    "Consulting",
    "Defense",
  ]);

  useEffect(() => {
    if (results.length > 0) {
      setShowWelcome(false);
    }
  }, [results]);

  // Function to format the entity type for display
  const formatEntityType = (type: string) => {
    switch (type) {
      case "2L":
        return "Limited Liability Company";
      case "8H":
        return "Nonprofit Organization";
      case "CJ":
        return "C Corporation";
      case "2X":
        return "S Corporation";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 border-x border-gray-800">
        <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 z-10">
          <h1 className="text-xl font-bold">SAM.gov Explorer</h1>
          {lastSearch && (
            <p className="text-sm text-gray-400 mt-1">
              Showing results for "{lastSearch}"
            </p>
          )}
        </header>

        <main className="p-4">
          {error && (
            <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : showWelcome && !error ? (
            <WelcomeScreen onSearch={handleSearch} />
          ) : filteredResults.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <p className="text-xl text-gray-400 mb-2">No results found</p>
              <p className="text-gray-500">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
              <button
                onClick={() => setShowWelcome(true)}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Back to search
              </button>
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
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold">
                        {entity.legalBusinessName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">
                          {entity.legalBusinessName}
                        </h2>
                        {entity.dbaName && (
                          <span className="text-gray-400 text-sm">
                            @{entity.dbaName.replace(/\s/g, "").toLowerCase()}
                          </span>
                        )}
                      </div>
                      {entity.registrationStatus === "A" && (
                        <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300">
                      {entity.addressLine1}
                      {entity.addressLine2 && `, ${entity.addressLine2}`}
                      <span className="text-gray-400">
                        {" • "}
                        {entity.city}, {entity.stateOrProvinceCode}{" "}
                        {entity.zipCode}
                      </span>
                    </p>

                    {entity.website && (
                      <a
                        href={
                          entity.website.startsWith("http")
                            ? entity.website
                            : `https://${entity.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        {entity.website}
                      </a>
                    )}

                    <div className="text-gray-400 text-sm">
                      Type: {formatEntityType(entity.entityStructure)}
                    </div>

                    <div className="flex gap-4 mt-2 text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>Repost</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>Like</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      <div className="hidden lg:block w-80 border-l border-gray-800 p-4">
        <div className="sticky top-4">
          <div className="mb-6">
            <div className="bg-gray-900 rounded-xl p-4">
              <h2 className="text-xl font-bold mb-4">Trending Topics</h2>
              <div className="space-y-4">
                {trending.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      handleSearch(topic);
                    }}
                    className="flex items-start hover:bg-gray-800/50 p-2 rounded-lg transition-colors w-full text-left"
                  >
                    <div>
                      <div className="text-sm text-gray-400">
                        Trending in Government
                      </div>
                      <div className="font-semibold">{topic}</div>
                      <div className="text-sm text-gray-400">
                        {Math.floor(Math.random() * 10000)} searches
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-900 rounded-xl p-4">
              <h2 className="text-xl font-bold mb-4">About SAM.gov</h2>
              <p className="text-gray-400 text-sm mb-4">
                The System for Award Management (SAM) is the official U.S.
                government system that consolidated the capabilities of
                CCR/FedReg, ORCA, and EPLS.
              </p>
              <a
                href="https://sam.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm"
              >
                Visit official site →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
