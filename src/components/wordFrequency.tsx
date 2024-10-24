import { removeStopwords } from 'stopword';
import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from 'react-modal';
import { WordCount } from '../utils/types';
import { WordPieChartProps } from '../utils/types';

const stopwordsList = ["de", "la", "que", "el", /* ...otras stopwords... */];

const WordPieChart: React.FC<WordPieChartProps> = ({ wordCounts }) => {
  const [dataForChart, setDataForChart] = useState<{ labels: string[], data: number[], wordsByFrequency: string[][] }>({ labels: [], data: [], wordsByFrequency: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<number>(0);

  useEffect(() => {
    if (Object.keys(wordCounts).length > 0) {
      const filteredWordCounts: WordCount = {};
      Object.entries(wordCounts).forEach(([word, count]) => {
        const filteredWord = removeStopwords([word], stopwordsList)[0];
        const isNumber = /^[0-9]+$/.test(filteredWord);
        if (filteredWord && !isNumber) filteredWordCounts[filteredWord] = count;
      });

      const groupedByFrequency: { [key: number]: string[] } = {};
      Object.entries(filteredWordCounts).forEach(([word, count]) => {
        if (!groupedByFrequency[count]) groupedByFrequency[count] = [];
        groupedByFrequency[count].push(word);
      });

      const labels = Object.keys(groupedByFrequency).map(count => `Frecuencia ${count}`);
      const data = Object.keys(groupedByFrequency).map(count => groupedByFrequency[parseInt(count)].length);
      const wordsByFrequency = Object.values(groupedByFrequency);

      setDataForChart({ labels, data, wordsByFrequency });
      setLoading(false);
    }
  }, [wordCounts]);

  const chartData = {
    labels: dataForChart.labels,
    datasets: [
      {
        label: 'Distribución de Palabras',
        data: dataForChart.data,
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    onClick: function ( elements: any) {
      if (elements.length > 0) {
        const index = elements[0].index;
        const words = dataForChart.wordsByFrequency[index];
        const frequency = parseInt(dataForChart.labels[index].split(' ')[1]);

        setSelectedWords(words);
        setSelectedFrequency(frequency);
        setModalIsOpen(true);
      }
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Distribución de Palabras</h3>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader loading={loading} size={50} color="#36D7B7" />
        </div>
      ) : (
        <>
          <Pie data={chartData} options={options} />

          <Modal 
            isOpen={modalIsOpen} 
            onRequestClose={() => setModalIsOpen(false)} 
            contentLabel="Palabras por Frecuencia"
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <div className="modal-header">
              <h2 className="text-lg font-bold">Frecuencia: {selectedFrequency}</h2>
              <button onClick={() => setModalIsOpen(false)} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                {selectedWords.map((word, index) => (
                  <div key={index} className="flex justify-between border-b pb-1">
                    <span>{word}</span>
                    <span>{selectedFrequency}x</span>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default WordPieChart;
