"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { SamEntity } from "../utils/samCsvParser";
import { useUserPreferences } from "./useUserPreferences";

interface UseSamSearchProps {
  initialQuery?: string;
}

interface SearchResult {
  results: SamEntity[];
  totalRecords: number;
  loading: boolean;
  error: string | null;
  isInitializing: boolean;
}

export function useSamSearch({ initialQuery = "" }: UseSamSearchProps = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SamEntity[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Get user preferences for personalized results
  const { preferences } = useUserPreferences();

  useEffect(() => {
    async function searchEntities() {
      if (!query.trim()) {
        setResults([]);
        setTotalRecords(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Apply user preferences to the search
        const preferredCapabilities = preferences.interestedCapabilities || [];
        const preferredState = preferences.preferredState;

        // Create the URL with search params
        const url = new URL("/api/sam-search", window.location.origin);
        url.searchParams.append("query", query);

        if (preferredState) {
          url.searchParams.append("state", preferredState);
        }

        preferredCapabilities.forEach((cap) => {
          url.searchParams.append("capabilities", cap);
        });

        const response = await axios.get(url.toString());

        // Check if data is still initializing
        if (response.status === 202) {
          setIsInitializing(true);
          setResults([]);
          setError(null);
          // Retry after a delay
          setTimeout(searchEntities, 2000);
          return;
        }

        setIsInitializing(false);
        setResults(response.data.results);
        setTotalRecords(response.data.totalRecords);
      } catch (err) {
        setIsInitializing(false);
        setError("Failed to search entities. Please try again.");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }

    // Add debounce to avoid too many requests
    const timeoutId = setTimeout(searchEntities, 300);
    return () => clearTimeout(timeoutId);
  }, [query, preferences]);

  return {
    query,
    setQuery,
    results,
    totalRecords,
    loading,
    error,
    isInitializing,
  };
}
