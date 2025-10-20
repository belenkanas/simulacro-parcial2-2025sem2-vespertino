import React, { useState, useEffect, useContext } from "react";
import { useParams, Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ErroresContext from "./contexts/Errores";
import VisitadosContext from "./contexts/Vistados";

const Country = () => {
    const { cca3 } = useParams();
    const navigate = useNavigate();

    const {points, losePoints} = useContext(ErroresContext);
    const {mode, addVisitado} = useContext(VisitadosContext);

    const [country, setCountry] = useState(null)
    const [paises, setPaises] = useState([]);
    const [correctos, setCorrectos] = useState([]);
    
    //Traigo país actual:
    async function obtenerPais() {
      try {
        const response = await fetch(`/api/countries/${cca3}`)
        if (!response.ok) {
          throw new Error('Error al obtener país');
        }
        const pais = await response.json();
        setCountry(pais);
        addVisitado(pais.cca3); //Lo agrego a los visitados
        setCorrectos(pais.borders ?? []); // guarda sus fronterizos
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
    useEffect(()=> {
        obtenerPais();
    }, [cca3]);

   //Fetch para traer todos los países y elegir 9 aleatorios para las opciones
    async function obtenerPaises() {
      try {
        const response = await fetch('/api/countries')
        if (!response.ok) {
          throw new Error('Error al obtener países');
        }
        const codigos = await response.json();
        const seleccion= new Set();

        //Priorizo agregar las opciones correctas primero
        if (country?.borders) {
            for (const border of country.borders) {
                if (seleccion.size < 9 && (!mode.includes(border))) seleccion.add(border);
            }
        }
        while (seleccion.size < 9) {
          const codigo = codigos[Math.floor(Math.random() * codigos.length)];
          if (!mode.includes(codigo)) seleccion.add(codigo);
        }

        //Mezclar opciones entre correctas e incorrectas:
          const arrayFinal = Array.from(seleccion);
          for (let i = arrayFinal.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayFinal[i], arrayFinal[j]] = [arrayFinal[j], arrayFinal[i]]; // intercambio
          }

          setPaises(arrayFinal);

          //Si no quiero mezclarlo lo hago así setPaises(Array.from(seleccion));
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    useEffect(()=> {
      if (country) obtenerPaises();
    }, [country]);

    
  
  function handleCorrecto(paisSeleccionado){
    const esCorrecto = correctos.includes(paisSeleccionado);
    if (esCorrecto){
        alert('Opcion correcta')
    }else{
        losePoints();
        if (points -1 <= 0){
            alert('Has perdido el juego');
            navigate('/end');
            return;
        }
        alert('Opcion incorrecta');
    }
    //redirige al país seleccionado (sea opcion correcta o no)
      addVisitado(paisSeleccionado)    
      navigate(`/country/${paisSeleccionado}`) 
    }

    async function handleNinguno(){
      if (correctos.length === 0){
        alert('Correcto, el país no tiene países borderizos')
      } else{
        alert('Incorrecto, el país sí tiene países borderizos');
        losePoints();
        if (points -1 <= 0){
            alert('Has perdido el juego');
            navigate('/end');
            return;
        }
      }

        const response = await fetch('/api/countries');
        const todos = await response.json();
        let random;
        do {
          random = todos[Math.floor(Math.random() * todos.length)];
        } while (mode.includes(random)); // elige uno no visitado

        navigate(`/country/${random}`);
    }

    if (!country) return <h2>Cargando país...</h2>;

    return (
        <>
        <div className="Country">

            <div className="card"> 
            <h1>{country.name?.common}</h1>
            <img
                src={country.flag?.svg}
                alt={country.flag?.alt ?? `Bandera de ${country.name?.common}`}
                width="200"
            />

            <h2>¿Cuál de los siguientes países es fronterizo?</h2>
            </div>
            <div className='banderasBotones'>
                {paises.map((pais, i) => (
                    <button 
                    key={i}
                    onClick={() => handleCorrecto(pais)}>
                        <img
                        src={`/flags/${pais}.svg`}
                        alt={pais ?? `Bandera de ${pais}`}
                        width="100"
                        />
                    </button>
                ))}
            </div>

            <button 
                className='buttonNinguno' 
                onClick={handleNinguno}>Ninguno
            </button>

            <div className="info">
                <h2>Usted lleva <strong style={{color:"blue"}}>{mode.length}</strong> países visitados</h2>
                <h2>Usted puede errarle <strong style={{color:"red"}}>{points}</strong> veces</h2>
            </div>
        </div>
        </>
    );
};

export default Country;