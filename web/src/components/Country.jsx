import React, { useState, useEffect } from "react";
import { useParams, Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Country = () => {
    const { cca3 } = useParams();
    const [country, setCountry] = useState(null);

    const navigate = useNavigate();


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
    

    if (!country) return <p>Cargando...</p>

    return (
        <>
        <div className="Country">
            <h1>{country.name?.common}</h1>

            <div className="card">

                <div className="imagenes">
                    <div>
                    {country.flag?.svg  && (
                        <img
                            src={country.flag.svg}
                            alt={`Bandera de ${country.name.common}`}
                        />     
                    )}
                    </div>

                    <div>
                    {country.map?.svg && (
                        <img
                        src={country.map.svg}
                        alt={`Mapa de ${country.name.common}`}
                        />
                    )}
                    </div>
                </div>

                <div className="info">
                    <p style={{fontSize: "120%"}}>
                        <em>{country.name.official}</em></p>
                    <p>
                        <strong>
                        Nombre oficial: {" "}
                        </strong>
                        {country.name?.nativeName
                        ? Object.values(country.name.nativeName)[0]?.official
                        : "No disponible"}
                    </p>
                    {/* <p>Nombre oficial (idioma oficial): {country.name.nativeName.spa.official}</p> */}
                    
                    <p>
                        <strong>
                        Capital: {" "} 
                        </strong>
                        {country.capital?.join(", ")}</p>
                    <p>
                        <strong>
                        Monedas:{" "}
                        </strong>
                        {Object.values(country.currencies || {})
                        .map((m) => m.name)
                        .join(", ")}
                        {" "}(
                        {Object.values(country.currencies || {})
                        .map((m) => m.symbol)
                        .join(", ")})
                    </p>
                    <p><strong>
                        Zonas horarias:
                        </strong> {country.timezones?.join(", ")}</p>
                </div>
            </div>

            <button 
                onClick={()=> {
                    navigate('/')}}
            >Continuar juego
            </button>
        </div>
        </>
    )


}

export default Country;