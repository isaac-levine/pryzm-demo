import { useState, useEffect } from "react";
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
    clearFilters,
    lastSearch,
  } = useSamGovData();

  const [searchQuery, setSearchQuery] = useState(lastSearch || "");

  // Update search query when lastSearch changes (from other components)
  useEffect(() => {
    if (lastSearch) {
      setSearchQuery(lastSearch);
    }
  }, [lastSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleSearch(searchQuery);
  };

  const handleSearchButtonClick = () => {
    if (!searchQuery.trim()) return;
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

  // Registration status display names
  const registrationStatusLabels: Record<string, string> = {
    A: "Active",
    E: "Expired",
    P: "Pending",
    Z1: "In Progress",
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
        <h2 className="text-xl font-bold">SAM.gov Explorer</h2>
      </div>

      <nav className="space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2"
            />
          </svg>
          <span>Home</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl"
        >
          <svg
            className="w-6 h-6"
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
          <span>Explore</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span>Notifications</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Profile</span>
        </a>
      </nav>

      <div className="mt-4">
        <button
          onClick={handleSearchButtonClick}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-colors"
        >
          Search
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="mt-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SAM.gov..."
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
        </div>
      </form>

      {searchHistory.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Recent Searches</h3>
            <button
              onClick={clearSearchHistory}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear all
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
                className="w-full text-left p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Filters</h3>
            {(filters.entityType.length > 0 ||
              filters.state.length > 0 ||
              filters.registrationStatus.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-gray-400"
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
                <h4 className="text-sm font-semibold">Entity Type</h4>
              </div>
              <div className="space-y-1">
                {["2L", "8H", "CJ", "2X"].map((type) => (
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
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {type === "2L"
                        ? "LLC"
                        : type === "8H"
                        ? "Nonprofit"
                        : type === "CJ"
                        ? "C Corporation"
                        : type === "2X"
                        ? "S Corporation"
                        : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-gray-400"
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
                <h4 className="text-sm font-semibold">State</h4>
              </div>
              <div className="space-y-1">
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
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {state}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-gray-400"
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
                <h4 className="text-sm font-semibold">Registration Status</h4>
              </div>
              <div className="space-y-1">
                {Object.entries(registrationStatusLabels).map(
                  ([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center space-x-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.registrationStatus.includes(key)}
                        onChange={() => updateFilter("registrationStatus", key)}
                        className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {label}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
