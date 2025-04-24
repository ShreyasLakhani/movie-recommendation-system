import { useState, FormEvent } from 'react';

// Props interface for the SearchBar component
interface SearchBarProps {
  onSearch: (query: string) => void;
}

// SearchBar component for searching movies
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none"
        >
          Search
        </button>
      </div>
    </form>
  );
} 