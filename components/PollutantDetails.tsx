
import React from 'react';
import { Pollutants } from '../types';

interface PollutantDetailsProps {
  pollutants: Pollutants;
}

const pollutantInfo = {
  pm25: { name: 'PM2.5', icon: 'fa-lungs', description: 'Particules fines' },
  pm10: { name: 'PM10', icon: 'fa-smog', description: 'Particules' },
  o3: { name: 'O₃', icon: 'fa-sun', description: 'Ozone' },
  no2: { name: 'NO₂', icon: 'fa-car', description: 'Dioxyde d\'azote' },
  so2: { name: 'SO₂', icon: 'fa-industry', description: 'Dioxyde de soufre' },
  co: { name: 'CO', icon: 'fa-fire', description: 'Monoxyde de carbone' },
};

const PollutantCard: React.FC<{ pollutantKey: keyof Pollutants, data: Pollutants[keyof Pollutants] }> = ({ pollutantKey, data }) => {
  const info = pollutantInfo[pollutantKey];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 flex items-center gap-4 transition-transform hover:scale-105 duration-300">
      <div className="text-blue-500 text-2xl w-8 text-center">
        <i className={`fas ${info.icon}`}></i>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-baseline">
          <h4 className="font-bold text-gray-800 dark:text-white">{info.name}</h4>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            {data.value.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between items-baseline text-sm">
          <p className="text-gray-500 dark:text-gray-400">{info.description}</p>
          <p className="text-gray-400 dark:text-gray-500">{data.unit}</p>
        </div>
      </div>
    </div>
  );
};


const PollutantDetails: React.FC<PollutantDetailsProps> = ({ pollutants }) => {
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-transparent dark:border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Détails des Polluants</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(pollutants) as Array<keyof Pollutants>).map((key) => (
          <PollutantCard key={key} pollutantKey={key} data={pollutants[key]} />
        ))}
      </div>
    </div>
  );
};

export default PollutantDetails;
