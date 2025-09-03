import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import Favorites from './pages/Favorites';
import './styles/App.css';

function App() {
  return (
    <Router>
      <FavoritesProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </FavoritesProvider>
    </Router>
  );
}

export default App;
