import React, { useEffect, useState } from 'react';
import { FaRetweet, FaComment, FaHeart, FaChartPie } from 'react-icons/fa';
import { fetchData } from '../utils/fetch';
import StatisticsModal from './staticModal';
import { fetchSentimentAnalysis } from '../utils/fetch';
import { ClipLoader } from 'react-spinners'; // Importa el componente del spinner
const TWEETS_PER_PAGE = 15; // Número de tweets por página

export interface TweetData {
  user: string;
  text: string;
  likes: string;
  comments: string;
  shares: string;
  reactions_count: string; // Asegúrate de que esta propiedad esté incluida
  sentiment?: string; // Esta propiedad puede ser opcional
}

const CsvReader: React.FC = () => {
  const [, setData] = useState<TweetData[]>([]);
  const [visibleData, setVisibleData] = useState<TweetData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedTweet, setSelectedTweet] = useState<TweetData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true); // Estado para determinar si hay más datos para cargar

  // Función para cargar datos en lotes de 15
  const loadMoreTweets = async () => {
    setLoading(true);
    try {
      const fetchedData: TweetData[] = await fetchData(startIndex, 15); // Llamada con los índices correctos
      
      // Si no hay más datos, actualizar el estado hasMoreData
      if (fetchedData.length < TWEETS_PER_PAGE) {
        setHasMoreData(false);
      }
      
      // Realizar el análisis de sentimiento para los nuevos tweets
      const dataWithSentiments = await Promise.all(fetchedData.map(async (tweet: TweetData) => {
        const sentiment = await fetchSentimentAnalysis(tweet.text);
        return { ...tweet, sentiment: sentiment || 'Sin Sentimiento' };
      }));

      setData((prevData) => [...prevData, ...dataWithSentiments]); // Añadir los nuevos datos
      setVisibleData((prevVisibleData) => [...prevVisibleData, ...dataWithSentiments]);
      setStartIndex((prevIndex) => prevIndex + TWEETS_PER_PAGE); // Incrementar el índice inicial
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar el primer lote al montar el componente
  useEffect(() => {
    loadMoreTweets();
  }, []);

  const openStatisticsModal = (tweet: TweetData) => {
    setSelectedTweet(tweet);
    setIsModalOpen(true);
  };

  const closeStatisticsModal = () => {
    setIsModalOpen(false);
    setSelectedTweet(null);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Tweets Publicados</h2>

      {visibleData.map((row, index) => (
        <div key={index} className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition-all">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900">{row.user || 'Usuario'}</div>
              <div className="text-sm text-gray-600">{row.text || 'Texto de ejemplo'}</div>
              <div className="text-sm text-blue-500">Sentimiento: {row.sentiment}</div>
              <div className="flex items-center space-x-4 mt-2 text-gray-500">
                <div className="flex items-center space-x-1">
                  <FaComment className="text-blue-400" />
                  <span>{formatNumber(Number(row.comments))}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaRetweet className="text-green-400" />
                  <span>{formatNumber(Number(row.shares))}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaHeart className="text-red-400" />
                  <span>{formatNumber(Number(row.likes))}</span>
                </div>

                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => openStatisticsModal(row)}>
                  <FaChartPie className="text-purple-400" />
                  <span>Ver Estadísticas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-center">
          <ClipLoader color="#000" loading={loading} size={50} /> {/* Usa tu spinner aquí */}
        </div>
      )}

      {/* Botón para cargar más tweets */}
      {hasMoreData && !loading && (
        <div className='flex justify-center'>
          <button
            onClick={loadMoreTweets}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mostrar más
          </button>
        </div>
      )}

      {selectedTweet && (
        <StatisticsModal
          isOpen={isModalOpen}
          onClose={closeStatisticsModal}
          tweetData={{
            likes: Number(selectedTweet.likes),
            comments: Number(selectedTweet.comments),
            shares: Number(selectedTweet.shares),
          }}
        />
      )}
    </div>
  );
};

export default CsvReader;
