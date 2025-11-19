
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md shadow-lg" role="alert">
      <div className="flex">
        <div className="py-1">
            <i className="fas fa-exclamation-triangle mr-3 text-red-500"></i>
        </div>
        <div>
          <p className="font-bold">Une erreur est survenue</p>
          <p className="text-sm">{message}</p>
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
