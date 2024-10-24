import { removeStopwords } from 'stopword'; // Solo importar la función
import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import ClipLoader from 'react-spinners/ClipLoader';
import { WordCount } from '../utils/types';
import { WordPieChartProps } from '../utils/types';


// Lista manual de stopwords en español
const stopwordsList = [
  "de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "las", "por", "un", 
  "para", "con", "no", "una", "su", "al", "lo", "como", "más", "pero", "sus", 
  "le", "ya", "o", "este", "sí", "porque", "esta", "entre", "cuando", "muy", 
  "sin", "sobre", "también", "me", "hasta", "hay", "donde", "quien", "desde", 
  "todo", "nos", "durante", "todos", "uno", "les", "ni", "contra", "otros", 
  "ese", "eso", "ante", "ellos", "e", "esto", "mí", "antes", "algunos", "qué", 
  "unos", "yo", "otro", "otras", "otra", "él", "tanto", "esa", "estos", "mucho", 
  "quienes", "nada", "muchos", "cual", "poco", "ella", "estar", "estas", "algunas", 
  "algo", "nosotros", "mi", "mis", "tú", "te", "ti", "tu", "tus", "ellas", "nosotras", 
  "vosotros", "vosotras", "os", "mío", "mía", "míos", "mías", "tuyo", "tuya", 
  "tuyos", "tuyas", "suyo", "suya", "suyos", "suyas", "nuestro", "nuestra", 
  "nuestros", "nuestras", "vuestro", "vuestra", "vuestros", "vuestras", "esos", 
  "esas", "estoy", "estás", "está", "estamos", "estáis", "están", "esté", "estés", 
  "estemos", "estéis", "estén", "estaré", "estarás", "estará", "estaremos", 
  "estaréis", "estarán", "estaría", "estarías", "estaríamos", "estaríais", "estarían"
];

const WordPieChart: React.FC<WordPieChartProps> = ({ wordCounts }) => {
  const [dataForChart, setDataForChart] = useState<{ labels: string[], data: number[], wordsByFrequency: string[][] }>({ labels: [], data: [], wordsByFrequency: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Object.keys(wordCounts).length > 0) {
      // Filtrar las palabras que no están en la lista de stopwords ni son números
      const filteredWordCounts: WordCount = {};
      Object.entries(wordCounts).forEach(([word, count]) => {
        const filteredWord = removeStopwords([word], stopwordsList)[0]; // removeStopwords devuelve un array
        const isNumber = /^[0-9]+$/.test(filteredWord); // Verificar si es un número

        if (filteredWord && !isNumber) { // Evitar agregar números
          filteredWordCounts[filteredWord] = count; // Solo agrega palabras que no sean stopwords ni números
        }
      });

      // Agrupar palabras por número de repeticiones
      const groupedByFrequency: { [key: number]: string[] } = {};
      Object.entries(filteredWordCounts).forEach(([word, count]) => {
        if (!groupedByFrequency[count]) {
          groupedByFrequency[count] = [];
        }
        groupedByFrequency[count].push(word);
      });

      // Crear etiquetas y datos para el gráfico
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
        label: 'Distribución de Palabras por Frecuencia',
        data: dataForChart.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', 
          'rgba(54, 162, 235, 0.6)', 
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)', 
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)', 
          'rgba(255, 99, 71, 0.6)',
          'rgba(64, 159, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 
          'rgba(54, 162, 235, 1)', 
          'rgba(75, 192, 192, 1)', 
          'rgba(255, 206, 86, 1)', 
          'rgba(153, 102, 255, 1)', 
          'rgba(255, 159, 64, 1)', 
          'rgba(255, 99, 71, 1)',
          'rgba(64, 159, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const frequencyIndex = context.dataIndex; // Índice de la porción actual en el gráfico
            const words = dataForChart.wordsByFrequency[frequencyIndex]; // Palabras que tienen esa frecuencia

            return `${label}: ${context.raw} veces\nPalabras: ${words.join(', ')}`;
          }
        }
      }
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Distribución de Palabras por Frecuencia</h3>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader loading={loading} size={50} color="#36D7B7" />
        </div>
      ) : (
        <Pie data={chartData} options={options} />
      )}
    </div>
  );
};

export default WordPieChart;