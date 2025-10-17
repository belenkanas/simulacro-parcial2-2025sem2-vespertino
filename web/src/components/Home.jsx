import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PointsContext from './contexts/Points.jsx';

export default function Home() {
  //Sistema de puntos:
  const {mode, addPoints, substractPoints} = useContext(PointsContext);
  
  const navigate = useNavigate();
  
  const [paises, setPaises] = useState([]); //Lista de países
  const [correcto, setCorrecto] = useState(null); //Opcion correcta
  const [mostrarBoton, setMostrarBoton] = useState(false); //Para mostrar el boton de continuar cuando esté correcto


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
        while (seleccion.length < 4){
          const indice = Math.floor(Math.random() * codigos.length);
          //Esto trae los códigos tipo URY, ARG, etc.
          const codigoPais = codigos[indice];

          if (!seleccion.includes(codigoPais)){
            seleccion.push(codigoPais);
          }
        }

        //Para traer la info completa de los países
        const detalles = await Promise.all(
          seleccion.map((codigoPais) => 
            fetch(`api/countries/${codigoPais}`).then((res) => res.json())
          )
        );

          const opcionCorrecta = Math.floor(Math.random()*seleccion.length);
          const paisCorrecto = detalles[opcionCorrecta];
          setPaises(detalles);
          setCorrecto(paisCorrecto);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    useEffect(()=> {
      obtenerPaises();
    }, []);
  
  function handleCorrecto(pais){
    if (pais.name.common === correcto.name.common){
      addPoints();
      alert('Opción correcta!!!')
      setMostrarBoton(true);
    } else {
      substractPoints();
      alert('Opción incorrecta')
    }
  }

  function recargarPagina() {
    setPaises([]);
    setCorrecto(null);
    setMostrarBoton(false);
    obtenerPaises();
  }
  
   
  return (
    <>
      <div className='Home'>
        <h1>Country Trivia</h1>

        {correcto ? (
        <div className='map'>
            <img
                src={correcto.map.svg}
                alt={`Mapa de ${correcto.name.common}`}
              />
            <h2>¿Cuál es la bandera del país del mapa?</h2>
        </div>
        ):(
          <p>Cargando ...</p>
        )}
        
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

        {mostrarBoton && (
          <button
            className='boton-home'
            onClick={() => {
              console.log('Codigo para ruta:', correcto.cca3);
              navigate(`/country/${correcto.cca3}`);
            }}
            style={{ marginTop: '10px' }}
          >
            Ver información
          </button>
        )}

        <div>
          <p>Usted tiene <strong>{mode}</strong> puntos</p>
        </div>

        <button 
          className='boton-home'
          onClick={recargarPagina}>Nuevo desafío</button>
      </div>
    </>
  );
}

