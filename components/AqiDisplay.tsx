
import React from 'react';

interface AqiDisplayProps {
  aqi: number;
  city: string;
}

const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { level: 'Bon', color: 'text-green-500', bgColor: 'bg-green-500/10', ringColor: 'stroke-green-500' };
  if (aqi <= 100) return { level: 'Modéré', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', ringColor: 'stroke-yellow-500' };
  if (aqi <= 150) return { level: 'Mauvais pour les groupes sensibles', color: 'text-orange-500', bgColor: 'bg-orange-500/10', ringColor: 'stroke-orange-500' };
  if (aqi <= 200) return { level: 'Mauvais', color: 'text-red-500', bgColor: 'bg-red-500/10', ringColor: 'stroke-red-500' };
  if (aqi <= 300) return { level: 'Très mauvais', color: 'text-purple-500', bgColor: 'bg-purple-500/10', ringColor: 'stroke-purple-500' };
  return { level: 'Dangereux', color: 'text-rose-700', bgColor: 'bg-rose-700/10', ringColor: 'stroke-rose-700' };
};

const AqiDisplay: React.FC<AqiDisplayProps> = ({ aqi, city }) => {
  const { level, color, bgColor, ringColor } = getAqiInfo(aqi);
  const circumference = 2 * Math.PI * 70; // 70 is the radius
  const offset = circumference - (Math.min(aqi, 300) / 300) * circumference;

  return (
    <div className={`p-6 rounded-2xl shadow-lg bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 transition-all duration-300 ${bgColor}`}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 160 160">
            <circle
              className="stroke-gray-200 dark:stroke-slate-700"
              strokeWidth="10"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
            />
            <circle
              className={`${ringColor} transition-all duration-1000 ease-out`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${color}`}>{aqi}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">IQA</span>
          </div>
        </div>
        <div className="flex-grow">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Indice de Qualité de l'Air à</p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{city}</h2>
          <span className={`px-4 py-2 rounded-full font-semibold text-lg ${color} ${bgColor}`}>
            {level}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AqiDisplay;
