
import React from 'react';
import { HealthRecommendations as HealthRecs } from '../types';

interface HealthRecommendationsProps {
  recommendations: HealthRecs;
}

const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-transparent dark:border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Conseils de Santé</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-users text-blue-500 text-xl"></i>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Population Générale</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{recommendations.general}</p>
        </div>
        <div className="flex-1 p-4 bg-orange-50 dark:bg-orange-900/40 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-heart-pulse text-orange-500 text-xl"></i>
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">Groupes Sensibles</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{recommendations.sensitiveGroups}</p>
        </div>
      </div>
    </div>
  );
};

export default HealthRecommendations;
