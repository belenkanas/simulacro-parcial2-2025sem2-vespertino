import React, { useState, useEffect, useContext } from "react";
import { useParams, Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ErroresContext from "./contexts/Errores";
import VisitadosContext from "./contexts/Vistados";

const Country = () => {
    const { cca3 } = useParams();
    const [country, setCountry] = useState(null);

    const {points, setPoints, losePoints} = useContext(ErroresContext);
    const {mode, addVisitado} = useContext(VisitadosContext);

    const [paises, setPaises] = useState([]);
    const [correctos, setCorrectos] = useState([]);
    const navigate = useNavigate();


     //FETCH para traer todos los countries y la guardamos en una lista de países
  //uso de fetch con async await.
    async function obtenerPaises() {
      try {
        const response = await fetch('api/countries')
        if (!response.ok) {
          throw new Error('Error al obtener países');
        }
        const codigos = await response.json();

        const seleccion= [];
        while (seleccion.length < 9){
          const indice = Math.floor(Math.random() * codigos.length);
          //Esto trae los códigos tipo URY, ARG, etc.
          const codigoPais = codigos[indice];

          if (!seleccion.includes(codigoPais)){
            seleccion.push(codigoPais);
          }
        }

          const opcionesCorrectas = [];
          setPaises(seleccion);
          setCorrectos(opcionesCorrectas);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    useEffect(()=> {
      obtenerPaises();
    }, []);

    useEffect(()=> {
    async function obtenerPais() {
      try {
        const response = await fetch(`/api/countries/${cca3}`)
        if (!response.ok) {
          throw new Error('Error al obtener país');
        }
        const pais = await response.json();
        setCountry(pais);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
    obtenerPais();
    }, [cca3]);
  
  function handleCorrecto(paisSeleccionado){
    if (paisSeleccionado.name.commom == correctos.name.common){ //((implemento mejor un find, ya que pueden haber más de un país limítrofe))
        alert('Opcion correcta')
    }else{
        losePoints();
        if (points === 0){
            alert('Has perdido el juego');
            navigate('/end');
        }else{
        alert('Opcion incorrecta');}
    }
    navigate(`/country/${paisSeleccionado.cca3}`) 
} 


    return (
        <>
        <div className="Country">
            <h1>{country.name?.common}</h1>

            <div className='banderasBotones'>
                {paises.map((pais, i) => (
                    <button 
                    key={i}
                    onClick={() => handleCorrecto(pais)}>
                        <img
                        src={pais.flag.svg}
                        alt={pais.flag.alt ?? `Bandera de ${pais.name?.common}`}
                        />
                    </button>
                ))}
            </div>


            <h2>Usted lleva {mode.count()} países visitados</h2>
            <h2>Usted puede errarle {errores.mode} veces</h2>
        </div>
        </>
    )


}

export default Country;