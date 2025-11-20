
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <i className="fas fa-wind text-2xl text-blue-500"></i>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Qualité de votre Air
            </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
