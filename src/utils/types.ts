
export interface UserData {
    email: string;
    password: string;
  }
  
export interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
  }



export  interface SentimentResult {
    label: string;
    score: number;
  }


  
  // Tipado del estado de las estadísticas
export  interface WordCount {
    [key: string]: number; // Cada palabra es la clave, y su conteo es el valor
  }

  // Definir las propiedades que recibe el componente
export interface WordPieChartProps {
    wordCounts: WordCount;
  }