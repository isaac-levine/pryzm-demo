"use client";

import { useState, useEffect } from "react";

export interface UserPreferences {
  preferredState?: string;
  interestedCapabilities?: string[];
  interestedIndustries?: string[];
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({});

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error("Failed to parse saved preferences:", e);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
  };

  return {
    preferences,
    updatePreferences,
  };
}
