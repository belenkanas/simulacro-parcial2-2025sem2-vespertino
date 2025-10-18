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
        addVisitado(pais.id); //Lo agrego a los visitados
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
            setCorrectos(country.borders);
            for (const border of country.borders) {
                if (seleccion.size < 9) seleccion.add(border);
            }
        }
        while (seleccion.size < 9) {
          const codigo = codigos[Math.floor(Math.random() * codigos.length)];
          seleccion.add(codigo);
        }

        const detalles = await Promise.all(
          Array.from(seleccion).map((codigoPais) => 
            fetch(`/api/countries/${codigoPais}`).then((res) => res.json())
          )
        );

          setPaises(detalles);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    useEffect(()=> {
      if (country) obtenerPaises();
    }, [country]);

    
  
  function handleCorrecto(paisSeleccionado){
    const esCorrecto = correctos.includes(paisSeleccionado.cca3);
    
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
        navigate(`/country/${paisSeleccionado.cca3}`) 
    }

    async function handleNinguno(){
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
                        src={pais.flag.svg}
                        alt={pais.flag.alt ?? `Bandera de ${pais.name?.common}`}
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
                <h2>Usted lleva {mode.length} países visitados</h2>
                <h2>Usted puede errarle <strong style={{color:"red"}}>{points}</strong> veces</h2>
            </div>
        </div>
        </>
    );
};

export default Country;