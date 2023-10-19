import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const Base = () => {
    
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const handleConfirmAction = () => {
    // Realiza la acción correspondiente en función de la opción seleccionada
    if (selectedOption === "opcion1") {
      // Lógica para "Crear personas"

      // Puedes enviar los datos al servidor, mostrar un mensaje, etc.
    } else if (selectedOption === "opcion2") {
      // Lógica para "Modificar datos personales"
    } else if (selectedOption === "opcion3") {
      // Lógica para "Consultar datos personales"
    } else if (selectedOption === "opcion4") {
      // Lógica para "Borrar personas"
    } else if (selectedOption === "opcion5") {
      // Lógica para "Consultar log"
    }
  };

  return (
    <div className=''>
      <h1>Tus datos personales</h1>
      <h2>Al alcance tuyo</h2>
      
      <div className='container'>
        <div className='centered-content'>
          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Crear personas</option>
            <option value="opcion2">Modificar datos personales</option>
            <option value="opcion3">Consultar datos personales</option>
            <option value="opcion4">Borrar personas</option>
            <option value="opcion5">Consultar log</option>
          </select>
          <button type="submit" onClick={handleConfirmAction}>Enviar</button>
        </div>
      </div>
    </div>
  );
}