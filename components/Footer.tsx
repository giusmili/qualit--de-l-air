
import React from 'react';

interface FooterProps {
    onRefresh: () => void;
    isLoading: boolean;
}

const Footer: React.FC<FooterProps> = ({ onRefresh, isLoading }) => {
  const COPYRIGHT: string | undefined =
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_COPYRIGHT) ||
    (typeof process !== 'undefined' && (process as any)?.env?.VITE_COPYRIGHT);
  return (
    <footer className="sticky bottom-0 left-0 right-0 p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm flex justify-between items-center border-t border-gray-200 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 select-none">
          {COPYRIGHT ? `© ${COPYRIGHT}` : ''}
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <i className={`fas fa-sync ${isLoading ? 'animate-spin' : ''}`}></i>
          <span>{isLoading ? 'Mise à jour...' : 'Actualiser la position'}</span>
        </button>
    </footer>
  );
};

export default Footer;
