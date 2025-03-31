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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">What are you looking for?</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Search for companies by name, website, or keywords. We'll help you find
        what you need in the SAM.gov database.
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-2">Search by Company Name</h3>
          <p className="text-sm text-gray-400">
            Find specific companies by their legal business name
          </p>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-2">Search by Website</h3>
          <p className="text-sm text-gray-400">
            Enter a company's website to find their registration
          </p>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-2">Search by Keywords</h3>
          <p className="text-sm text-gray-400">
            Use keywords to find companies in specific industries
          </p>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-2">Search by Location</h3>
          <p className="text-sm text-gray-400">
            Find companies registered in specific states
          </p>
        </div>
      </div>
    </div>
  );
}
