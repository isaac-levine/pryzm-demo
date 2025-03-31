import { useState, useEffect } from "react";
import { searchEntities, EntitySearchResult } from "../utils/samGovApi";
import { Filters } from "../components/Sidebar";

interface SamGovState {
  results: EntitySearchResult[];
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
        return JSON.parse(savedState);
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
      setState((prev) => ({
        ...prev,
        results: data,
        loading: false,
        searchHistory: [
          query,
          ...prev.searchHistory.filter((h) => h !== query).slice(0, 4),
        ],
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch results. Please try again.",
      }));
      console.error(err);
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

  const filteredResults = state.results.filter((entity) => {
    if (
      state.filters.entityType.length > 0 &&
      !state.filters.entityType.includes(entity.entityStructure)
    ) {
      return false;
    }
    if (
      state.filters.state.length > 0 &&
      !state.filters.state.includes(entity.address.stateOrProvinceCode)
    ) {
      return false;
    }
    return true;
  });

  return {
    ...state,
    filteredResults,
    handleSearch,
    handleFilterChange,
    clearFilters,
    clearSearchHistory,
  };
}
