import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Country from './Country.jsx';
import PointsContext from './contexts/Points.jsx';

export default function App() {
  //Sistema de puntos (que será envuelta dentro del contexto):
    const [points, setPoints] = useState(0);
    const pointsSettings = {
      mode: points,
      addPoints: () => setPoints((p) => p + 1),
      substractPoints: () => setPoints((p) => p - 1),
    };

  return (
    <PointsContext.Provider value={pointsSettings}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/country/:cca3' element={<Country />} />
      </Routes>
    </BrowserRouter>
    </PointsContext.Provider>
  );
}
