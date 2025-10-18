import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VisitadosContext from './contexts/Vistados'

export default function End() {
    
    const navigate = useNavigate();
    const {mode} = useContext(VisitadosContext);
    const [visitados, setVisitados] = useState([]);
    
    async function obtenerVisitados() {
        try{
            const data = await Promise.all(
            mode.map((codigoPais) =>
                fetch(`/api/countries/${codigoPais}`).then((res) => res.json())
            )
            );
            setVisitados(data);
        }
        catch (error){
            console.error('Error: ', error.message)
        }
    }

    useEffect(()=> {
        if (mode && mode.length > 0) {
            obtenerVisitados();
        }
    }, [mode]);

    if (visitados.length === 0) return <p>Cargando países visitados...</p>;

    return (
    <>
    <div className='End'>
        <h1>Fin del juego</h1>
        <h2>Usted visitó en total <strong>{mode.length}</strong> países:</h2>


        <div className='banderasBotones'>
            {visitados.map((pais, i) => (
                <button 
                key={i}>
                    <img
                    src={pais.flag?.svg}
                    alt={pais.flag?.alt ?? `Bandera de ${pais.name?.common}`}
                    width="100"
                    />
                </button>
            ))}
        </div>

        <button 
            className="botonContinuar"
            onClick={()=> navigate('/')}
        >Continuar</button>
    </div>
    </>
  )
}
