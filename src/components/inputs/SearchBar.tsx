
import React, { useRef, FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [_, setSearchParams] = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      const query = inputRef.current.value.trim();
      setSearchParams(query ? { search: query } : {});
      onSearch(query);
    }
  };

  return (
    <div className="w-full p-4">
      <form onSubmit={handleSubmit}>
        <div className="relative flex">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search or type command..."
            className="dark:bg-dark-900 h-11 w-full rounded-s-lg border border-gray-200 border-r-0 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
          />

          <button
            type="submit"
            className="h-11 w-12 flex items-center justify-center rounded-e-lg border border-gray-200 border-l-0 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/70 dark:hover:bg-white/[0.06] transition-colors"
          >
            <FaSearch size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
