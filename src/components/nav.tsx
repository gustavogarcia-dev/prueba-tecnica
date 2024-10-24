import React from 'react';
import { FaHome, FaChartBar, FaSignOutAlt } from 'react-icons/fa'; // Importar íconos
import { Link, useNavigate } from 'react-router-dom'; // Para las rutas

const NavBar: React.FC = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const currentUserId = localStorage.getItem('currentUserId');
  const userName = localStorage.getItem(`${currentUserId}_userName`);
  // const userEmail = localStorage.getItem(`${currentUserId}_userEmail`);

  const handleLogout = () => {
    localStorage.removeItem(`${currentUserId}_userName`);
    localStorage.removeItem(`${currentUserId}_userEmail`);
    localStorage.removeItem('currentUserId'); // Limpiar el ID del usuario actual
    // No hay necesidad de eliminar un token, ya que no se está usando
    navigate('/'); // Redirigir a la página de login
  };
  

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold  flex items-center">
          <span className="mr-2">Bienvenido {userName}</span>
          <button
            onClick={handleLogout}
            className="flex items-center text-white bg-red-600 hover:bg-red-700 text-sm transition-all px-3   py-2 rounded-lg"
          >
            <FaSignOutAlt className="mr-1" />
            Logout
          </button>
        </div>
        <ul className="flex space-x-8">
          <li>
            <Link to="/home" className="text-white flex items-center hover:text-yellow-300 transition-all">
              <FaHome className="mr-2" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/estadisticas" className="text-white flex items-center hover:text-yellow-300 transition-all">
              <FaChartBar className="mr-2" />
              Estadísticas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
