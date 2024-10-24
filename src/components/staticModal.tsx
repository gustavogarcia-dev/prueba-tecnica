import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar todos los elementos necesarios
ChartJS.register(ArcElement, Tooltip, Legend);

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tweetData: { likes: number; comments: number; shares: number };
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, tweetData }) => {
  if (!isOpen) return null;

  const data = {
    labels: ['Likes', 'Comments', 'Shares'],
    datasets: [
      {
        label: 'Tweet Statistics',
        data: [tweetData.likes, tweetData.comments, tweetData.shares],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Estadísticas del Tweet</h2>
        <Pie data={data} />
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default StatisticsModal;
