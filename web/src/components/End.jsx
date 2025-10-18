import React from 'react'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VisitadosContext from './contexts/Vistados'

export default function End() {
    
    const navigate = useNavigate();
    const {mode} = useContext(VisitadosContext);
    
    async function obtenerVisitados() {
        try{
            const response = await fetch('/api/countries')
            if (!response.ok) throw new Error('Error al obtener países')
            for (codigos of mode){
                //Ha
            }
        
        }
        catch (error){
            console.error('Error: ', error.message)
        }
    }

    useEffect(()=> {
        obtenerVisitados;
    }, []);

    return (
    <>
        <h1>Fin del juego</h1>
        <h2>Usted visitó los siguientes países</h2>


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
            onClick={()=> navigate('./')}
        ></button>
    </>
  )
}
