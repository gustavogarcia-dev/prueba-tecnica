import React, { useEffect, useState } from 'react';
import { fetchData } from '../utils/fetch'; // Asegúrate de que la función fetchData esté correctamente tipada
import { FaRetweet, FaComment, FaHeart } from 'react-icons/fa';
import NavBar from './nav';
import WordFrequency from './wordFrequency';
import { TweetData } from './csvReader';
import { WordCount } from '../utils/types';

const Statistics: React.FC = () => {
  const [, setData] = useState<TweetData[]>([]); // Estado que guarda los datos de los tweets
  const [, setLoading] = useState<boolean>(false); // Estado de carga
  const [processing, setProcessing] = useState<boolean>(true); // Estado de procesamiento
  const [topLikes, setTopLikes] = useState<TweetData | null>(null); // Tweet con más likes
  const [topComments, setTopComments] = useState<TweetData | null>(null); // Tweet con más comentarios
  const [topShares, setTopShares] = useState<TweetData | null>(null); // Tweet con más compartidos
  const [wordCounts, setWordCounts] = useState<WordCount>({}); // Estado del conteo de palabras

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchData(0, 2000); // Asegúrate de obtener todos los datos
        const flattenedData = fetchedData.flat(); // Aplana los datos si están anidados
        setData(flattenedData);
        analyzeStatistics(flattenedData); // Analizar estadísticas
        analyzeWordFrequency(flattenedData); // Analizar las palabras
        setProcessing(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Función para analizar estadísticas de likes, comentarios y compartidos
  const analyzeStatistics = (data: TweetData[]) => {
    if (!data.length) return;

    const topLiked = data.reduce((prev, current) => {
      return Number(prev.likes) > Number(current.likes) ? prev : current;
    });

    const topCommented = data.reduce((prev, current) => {
      return Number(prev.comments) > Number(current.comments) ? prev : current;
    });

    const topShared = data.reduce((prev, current) => {
      return Number(prev.shares) > Number(current.shares) ? prev : current;
    });

    setTopLikes(topLiked);
    setTopComments(topCommented);
    setTopShares(topShared);
  };

  // analizar la frecuencia de las palabras en los tweets
  const analyzeWordFrequency = (data: TweetData[]) => {
    const connectors = ['del', 'a', 'en', 'los', 'mis', 'mío', 'y', 'que', 'de', 'el', 'la', 'un', 'una', 'es'];
    const wordCount: WordCount = {};
  
    data.forEach(item => {
      const words = item.text.split(/\s+/); 
      
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\wáéíóúñ]/g, ''); 
        
        if (cleanWord && !connectors.includes(cleanWord)) {
          wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1; 
        }
      });
    });
  
    setWordCounts(wordCount); // Actualiza el estado con el conteo de palabras
  };

  const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse p-4 bg-gray-300 rounded-lg h-24 flex items-center justify-center">
      Procesando estadísticas...
    </div>
  );

  return (
    <div className='p-4'>
      <NavBar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6">Estadísticas de Publicaciones</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="statistic-item bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
            <div className="flex-shrink-0 w-12 h-12 flex justify-center items-center">
              <FaHeart className="text-red-500 text-4xl" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold">Publicación con más Likes:</h3>
              {processing ? <LoadingSkeleton /> : <p className="text-gray-700">{topLikes?.text || 'N/A'}</p>}
              <span className="text-red-500 font-bold">{topLikes?.likes || 'N/A'}</span>
            </div>
          </div>

          <div className="statistic-item bg-green-100 p-4 rounded-lg shadow-md flex items-center">
            <div className="flex-shrink-0 w-12 h-12 flex justify-center items-center">
              <FaComment className="text-blue-500 text-4xl" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold">Publicación con más Comentarios:</h3>
              {processing ? <LoadingSkeleton /> : <p className="text-gray-700">{topComments?.text || 'N/A'}</p>}
              <span className="text-blue-500 font-bold">{topComments?.comments || 'N/A'}</span>
            </div>
          </div>

          <div className="statistic-item bg-yellow-100 p-4 rounded-lg shadow-md flex items-center">
            <div className="flex-shrink-0 w-12 h-12 flex justify-center items-center">
              <FaRetweet className="text-green-500 text-4xl" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold">Publicación con más Compartidas:</h3>
              {processing ? <LoadingSkeleton /> : <p className="text-gray-700">{topShares?.text || 'N/A'}</p>}
              <span className="text-green-500 font-bold">{topShares?.shares || 'N/A'}</span>
            </div>
          </div>
        </div>

        <WordFrequency wordCounts={wordCounts} />
      </div>
    </div>
  );
};

export default Statistics;
