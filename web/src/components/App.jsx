import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Country from './Country.jsx';
import ErroresContext from './contexts/Errores.jsx';
import VisitadosContext from './contexts/Vistados.jsx';
import End from './End.jsx';

export default function App() {
  //Sistema de puntos de errores (que será envuelta dentro del contexto):
    const [errores, setErrores] = useState(0);
    const erroresSettings = {
      points: errores,
      setPoints: setErrores,
      losePoints: () => setErrores((p) => p - 1),
    };
  
  //Sistema de países visitados. Es una lista con los mismos
  const [visitados, setVisitados] = useState([])
  const visitadosSettings ={
    mode: visitados,
    addVisitado: (p) => {
    if (!visitados.includes(p)) {
        setVisitados([...visitados, p]);
      }
    }
  };

  return (
    <ErroresContext.Provider value={erroresSettings}>
      <VisitadosContext.Provider value={visitadosSettings}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/country/:cca3' element={<Country />} />
            <Route path='/end' element={<End />} />
          </Routes>
        </BrowserRouter>
      </VisitadosContext.Provider>
    </ErroresContext.Provider>
  );
}
