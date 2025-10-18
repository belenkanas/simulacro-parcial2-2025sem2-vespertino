import React from 'react'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VisitadosContext from './contexts/Vistados'

export default function End() {
    
    const {mode} = useContext(VisitadosContext);
    
    async function obtenerPaises() {
        try{
            const response = await fetch('/api/countries')
            if (!response.ok) throw new Error('Error al obtener países')
        }
        catch (error){
            console.error('Error: ', error.message)
        }
    }

    useEffect(()=> {
        obtenerPaises;
    }, []);

    return (
    <>
        <h1>Fin del juego</h1>
        <h2>Usted visitó los siguientes países</h2>
    </>
  )
}
