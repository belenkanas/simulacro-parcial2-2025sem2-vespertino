import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import VisitadosContext from './contexts/Vistados';
import ErroresContext from './contexts/Errores';

export default function Home() {

  const {mode, addVisitado} = useContext(VisitadosContext);
  const {points} = useContext(ErroresContext);

  const [pais, setPais] = useState(null);

  async function obtenerPaisRandom(){
    try{
      const response = await fetch(`api/countries`)
      if (!response.ok){
        throw new Error('Error al obtener países');
      }
      const codigos = await response.json();
      //Tengo los códigos de los países tipo URY, ARG, BRA, etc

      const codigoRandom = Math.floor(Math.random() * codigos.length);
      let paisRandom = codigos[codigoRandom];
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
      points = 8;
    } else if (modo === 'medio'){
      points = 5;
    } else if (modo === 'dificil'){
      points = 3;
    }
    navigate(`/country/${pais.cca3}`)
  }

  return (
    <>
      <h1>Flag Trivia</h1>
      <h2>Elija la dificultad del juego</h2>

    <div>
      <button onClick={handleEleccion('facil')}>Fácil</button>
    </div>

    <div>
      <button onClick={handleEleccion('medio')}>Fácil</button>
    </div>

    <div>
      <button onClick={handleEleccion('dificil')}>Fácil</button>
    </div>

    
    </>
  )
}
