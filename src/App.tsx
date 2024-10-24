import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Home from './components/Home';
import Statistics from './components/estadisticas';
import './App.css';

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Router>
      <div className="form-container">
        <AnimatePresence>
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Login toggleForm={toggleForm} />
                </motion.div>
              }
            />
            <Route
              path="/register"
              element={
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Register toggleForm={toggleForm} />
                </motion.div>
              }
            />
            <Route path='/home' element={<Home/>} />
            <Route path='/estadisticas' element={<Statistics />} />

          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;
