import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WithAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
      // Verifica si el ID del usuario actual existe en el localStorage
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Simulamos una redirección con un retraso
        setTimeout(() => {
          navigate('/'); // Redirige a la página de login si no hay usuario autenticado
        }, 1500); // Cambia el tiempo si lo deseas
      }
      setLoading(false); // Finaliza la carga
    }, [navigate]);

    if (loading) {
      return <div className="spinner">Cargando...</div>; // Reemplaza esto con un spinner real
    }

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // O un spinner de carga
    }

    return isAuthenticated ? (
      <WrappedComponent {...props} />
    ) : (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
        <p className="text-lg mb-6">No estás autenticado. Redirigiendo a la página de inicio de sesión...</p>
        <p>Si no eres redirigido automáticamente, haz clic en el botón a continuación:</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Ir a la página de inicio de sesión
        </button>
      </div>
    );
  };

  return Wrapper;
};

export default WithAuth;
