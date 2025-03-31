import { useState, useEffect } from "react";
import { searchEntities, filterEntities, SamEntity } from "../utils/samGovData";
import { Filters } from "../components/Sidebar";

interface SamGovState {
  results: SamEntity[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  searchHistory: string[];
  lastSearch: string | null;
}

export function useSamGovData() {
  const [state, setState] = useState<SamGovState>(() => {
    // Try to load initial state from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("samGovState");
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error("Failed to parse saved state:", e);
        }
      }
    }
    return {
      results: [],
      loading: false,
      error: null,
      filters: {
        entityType: [],
        state: [],
        registrationStatus: [],
      },
      searchHistory: [],
      lastSearch: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("samGovState", JSON.stringify(state));
    }
  }, [state]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      lastSearch: query,
    }));

    try {
      const data = await searchEntities(query);

      // Only update state if we got results
      if (data.length > 0) {
        setState((prev) => ({
          ...prev,
          results: data,
          loading: false,
          searchHistory: [
            query,
            ...prev.searchHistory.filter((h) => h !== query).slice(0, 4),
          ],
        }));
      } else {
        // Show a message if no results were found
        setState((prev) => ({
          ...prev,
          loading: false,
          results: [],
          error: "No matching entities found. Try a different search term.",
        }));
      }
    } catch (err) {
      console.error("Search error:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to search entities. Using example data.",
      }));
    }
  };

  const handleFilterChange = (filters: Filters) => {
    setState((prev) => ({
      ...prev,
      filters,
    }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      filters: {
        entityType: [],
        state: [],
        registrationStatus: [],
      },
    }));
  };

  const clearSearchHistory = () => {
    setState((prev) => ({
      ...prev,
      searchHistory: [],
    }));
  };

  const filteredResults = filterEntities(state.results, state.filters);

  return {
    ...state,
    filteredResults,
    handleSearch,
    handleFilterChange,
    clearFilters,
    clearSearchHistory,
  };
}
