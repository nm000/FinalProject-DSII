import React, { useState } from 'react';
import './App.css';

function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

function DropMenu() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  }

  return (
    <div>
      <h2></h2>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">Selecciona una opción</option>
        <option value="opcion1">Crear personas</option>
        <option value="opcion2">Modificar datos personales</option>
        <option value="opcion3">Consultar datos personales</option>
        <option value="opcion4">Borrar personas</option>
        <option value="opcion5">Consultar log</option>  
      </select>
    </div>
  );
}

  // <p>Selección: {selectedOption}</p>

export default function MyApp() {
  return (
    <div className=''>
      <h1>Tus datos personales</h1>
      <h2>Al alcance tuyo</h2>
      <div className='container'>
        <div className='centered-content'>
          <DropMenu />
        </div>
      </div>
    </div>
  );
}