import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogConsole = () => {

  // Acá solo se usa el num de documento
  // Esta página solo muestra un input para el documento, que se envía después a la página de update
  const [numDoc, setnumDoc] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');
  const [fecha, setfecha] = useState('');

  const navigate = useNavigate();

  // Inicializar variable que contendrá todos los datos de la persona
  const [personaData, setPersonaData] = useState({});

  const submit = async e => {

    e.preventDefault();
    // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
    try {

      // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
      const persona = await fetch(`http://localhost:8004/log?tipoDoc=${tipoDoc}&numDoc=${numDoc}&fecha=${fecha}`);

      if (persona.ok) {
        const personaData = await persona.json();
        console.log(personaData)
        // colocar en personaData todos los datos de la persona
        setPersonaData(personaData);

      } else {
        console.error('Error en la solicitud HTTP');
      }
    } catch (error) {
      console.error('Ocurrió un error:', error);
    }

  }

  // Solo un HTML para el input del num de documento
  return (
  <div className='container'>
    <form>
      <div>
        <label htmlFor="nroDocumento">Nro. Documento:</label>
        <input
          type="text"
          id="nroDocumento"
          name="nroDocumento"
          // onChange actualiza la variable del dato cada vez que se cambia en el input
          onChange={e => setnumDoc(e.target.value)}
        />
      </div>

      <button type="submit" onClick={submit}>Submit</button>

    </form>
  </div>
  );
}