import React, { useState } from 'react';

interface CitySearchProps {
  onSubmit: (city: string) => void;
  disabled?: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({ onSubmit, disabled }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full">
      <input
        type="text"
        placeholder="Entrez une ville (ex: Paris, France)"
        className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        aria-label="Ville"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        Rechercher
      </button>
    </form>
  );
};

export default CitySearch;

