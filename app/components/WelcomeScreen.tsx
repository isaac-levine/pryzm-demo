import { useState } from "react";

interface WelcomeScreenProps {
  onSearch: (query: string) => void;
}

export default function WelcomeScreen({ onSearch }: WelcomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    await onSearch(searchQuery);
    setIsLoading(false);
  };

  const searchExamples = [
    {
      name: "Construction",
      description: "Find construction companies and contractors",
    },
    {
      name: "Technology",
      description: "Search for IT and technology service providers",
    },
    {
      name: "Healthcare",
      description: "Discover medical suppliers and healthcare providers",
    },
    {
      name: "www.example.com",
      description: "Find entities by their website domain",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Explore SAM.gov Entities</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Search for companies registered with the U.S. government. Find
        contractors, grantees, and other entities in the System for Award
        Management database.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter company name, website, or keywords..."
            className="w-full p-4 bg-gray-900 rounded-full border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-4">Try searching for:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {searchExamples.map((example) => (
            <button
              key={example.name}
              onClick={() => {
                setSearchQuery(example.name);
                onSearch(example.name);
              }}
              className="flex flex-col items-start p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors text-left"
            >
              <span className="font-medium text-white mb-1">
                {example.name}
              </span>
              <span className="text-sm text-gray-400">
                {example.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
