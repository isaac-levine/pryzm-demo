import { useState } from "react";
import { useSamGovData } from "../hooks/useSamGovData";

export interface Filters {
  entityType: string[];
  state: string[];
  registrationStatus: string[];
}

export default function Sidebar() {
  const {
    handleSearch,
    handleFilterChange,
    filters,
    searchHistory,
    clearSearchHistory,
    lastSearch,
  } = useSamGovData();

  const [searchQuery, setSearchQuery] = useState(lastSearch || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const updateFilter = (category: keyof Filters, value: string) => {
    const newFilters = {
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((v) => v !== value)
        : [...filters[category], value],
    };
    handleFilterChange(newFilters);
  };

  return (
    <div className="w-80 p-4 border-r border-gray-800 flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-8 h-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
        <h2 className="text-xl font-bold">SAM.gov Search</h2>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search companies..."
          className="w-full p-3 bg-gray-900 rounded-full border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {searchHistory.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Recent Searches</h3>
            <button
              onClick={clearSearchHistory}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {searchHistory.map((query) => (
              <button
                key={query}
                onClick={() => {
                  setSearchQuery(query);
                  handleSearch(query);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-900/50 transition-colors text-gray-300 hover:text-white"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-bold">Entity Type</h3>
          </div>
          <div className="space-y-2">
            {["Corporation", "LLC", "Partnership", "Sole Proprietorship"].map(
              (type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.entityType.includes(type)}
                    onChange={() => updateFilter("entityType", type)}
                    className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {type}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-lg font-bold">State</h3>
          </div>
          <div className="space-y-2">
            {["CA", "NY", "TX", "FL", "IL"].map((state) => (
              <label
                key={state}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.state.includes(state)}
                  onChange={() => updateFilter("state", state)}
                  className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {state}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-bold">Registration Status</h3>
          </div>
          <div className="space-y-2">
            {["Active", "Inactive", "Pending"].map((status) => (
              <label
                key={status}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.registrationStatus.includes(status)}
                  onChange={() => updateFilter("registrationStatus", status)}
                  className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
