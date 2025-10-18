import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VisitadosContext from './contexts/Vistados.jsx';
import ErroresContext from './contexts/Errores.jsx';

export default function Home() {

  const {addVisitado} = useContext(VisitadosContext);
  const {setPoints} = useContext(ErroresContext);

  const [pais, setPais] = useState(null);
  const navigate = useNavigate();

  async function obtenerPaisRandom(){
    try{
      const response = await fetch(`api/countries`)
      if (!response.ok){
        throw new Error('Error al obtener países');
      }
      const codigos = await response.json();
      //Tengo los códigos de los países tipo URY, ARG, BRA, etc

      const codigoRandom = Math.floor(Math.random() * codigos.length);
      const paisRandom = codigos[codigoRandom];
      addVisitado(paisRandom);
      setPais(paisRandom);

    } catch (error){
      console.error('Error:', error.message);
    }
  }

  useEffect(()=> {
    obtenerPaisRandom();
  },[]);

  function handleEleccion(modo){
    //Segun la eleccion que se hace, se ajustan los errores permitidos en el contexto
    if (modo === 'facil'){
      setPoints(8);
    } else if (modo === 'medio'){
      setPoints(5);
    } else if (modo === 'dificil'){
      setPoints(3);
    }
    navigate(`/country/${pais}`)
    //Va al país random
  }

  return (
    <>
      <h1>Flag Trivia</h1>
      <h2>Elija la dificultad del juego</h2>

    <div>
      <button onClick={() => handleEleccion('facil')}>Fácil</button>
    </div>

    <div>
      <button onClick={() => handleEleccion('medio')}>Medio</button>
    </div>

    <div>
      <button onClick={() => handleEleccion('dificil')}>Difícil</button>
    </div>

    
    </>
  )
}
