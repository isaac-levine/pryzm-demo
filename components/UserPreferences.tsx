"use client";

import React, { useState } from "react";
import { useUserPreferences } from "../hooks/useUserPreferences";

// Common capabilities that users might be interested in
const COMMON_CAPABILITIES = [
  "Software Development",
  "IT Services",
  "Cybersecurity",
  "Cloud Services",
  "Data Analytics",
  "Consulting",
  "Healthcare",
  "Construction",
  "Research and Development",
  "Manufacturing",
];

// U.S. states for preference selection
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export default function UserPreferences() {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isOpen, setIsOpen] = useState(false);

  const handleCapabilityToggle = (capability: string) => {
    const current = preferences.interestedCapabilities || [];
    const updated = current.includes(capability)
      ? current.filter((c) => c !== capability)
      : [...current, capability];

    updatePreferences({ interestedCapabilities: updated });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ preferredState: e.target.value || undefined });
  };

  return (
    <div className="my-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {isOpen ? "Hide Preferences" : "Personalize Your Search"}
      </button>

      {isOpen && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Search Preferences</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Preferred State:
            </label>
            <select
              value={preferences.preferredState || ""}
              onChange={handleStateChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Any State</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Interested Capabilities:
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_CAPABILITIES.map((capability) => (
                <button
                  key={capability}
                  onClick={() => handleCapabilityToggle(capability)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    (preferences.interestedCapabilities || []).includes(
                      capability
                    )
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {capability}
                </button>
              ))}
            </div>
          </div>

          {((preferences.interestedCapabilities &&
            preferences.interestedCapabilities.length > 0) ||
            preferences.preferredState) && (
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Your search results will be personalized based on your
                preferences.
                {preferences.preferredState && (
                  <span>
                    {" "}
                    Prioritizing results from {preferences.preferredState}.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
