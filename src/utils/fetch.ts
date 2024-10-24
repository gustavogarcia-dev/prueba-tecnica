import Papa from 'papaparse';
import { TweetData } from '../components/csvReader';


interface ScoreResult {
  label: 'LABEL_0' | 'LABEL_1' | 'LABEL_2';
  score: number; 
}
const HUGGING_FACE_API_TOKEN = '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';

export  const fetchSentimentAnalysis = async (text: string): Promise<string | null> => {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener el análisis de sentimiento');
      }
  
      const result= await response.json();
  
      if (Array.isArray(result) && result.length > 0) {

        // Limpiar la respuesta y encontrar el objeto con el mayor score
        const maxScoreResult: ScoreResult[] = result[0]; // Suponiendo que la API siempre devuelve un array con un único elemento
        const maxScore = maxScoreResult.reduce((prev:ScoreResult, current:ScoreResult) => {
          return (prev.score > current.score) ? prev : current;
        });
  
        // Mapa de etiquetas a descripciones
        const sentimentDescriptions:  Record<'LABEL_0' | 'LABEL_1' | 'LABEL_2', string>= {
          LABEL_0: 'Negativo',
          LABEL_1: 'Neutral',
          LABEL_2: 'Positivo',
        };
      
        
        // Obtener la descripción correspondiente
        const sentimentDescription = sentimentDescriptions[maxScore.label] || 'Desconocido';
        return sentimentDescription; // Devuelve la descripción correspondiente
      } else {
        console.error('Respuesta de la API no válida:', result);
        return null; // En caso de error, devuelve null
      }
    } catch (error) {
      console.error('Error en la API de HuggingFace:', error);
      return null; // En caso de error, devuelve null
    }
  };

  

  export const fetchData = async (start: number, limit: number): Promise<TweetData[]> => {
    return new Promise<TweetData[]>((resolve, reject) => {
      Papa.parse<TweetData>('../../DataRedesSociales.csv', {
        download: true,
        header: true,
        complete: (results) => {
          const rows = results.data;
          const slicedRows = rows.slice(start, start + limit); // Devuelve solo un lote de datos
          resolve(slicedRows); // Devuelve los datos procesados
        },
        error: (error) => {
          console.error('Error al leer el CSV:', error);
          reject(error); // Rechaza la promesa en caso de error
        },
      });
    });
  };
  
  
