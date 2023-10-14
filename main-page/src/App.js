import React, { useState } from 'react';
import './App.css';

export default function MyApp() {
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({
    tipoDocumento: '',
    nroDocumento: '',
    primerNombre: '',
    segundoNombre: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    correoElectronico: '',
    celular: '',
    foto: '',
  });

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirmAction = () => {
    // Realiza la acción correspondiente en función de la opción seleccionada
    if (selectedOption === "opcion1") {
      // Lógica para "Crear personas"
      console.log('hola')
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
        <form>
        <div>
          <label htmlFor="tipoDocumento">Tipo de Documento:</label>
          <input
            type="text"
            id="tipoDocumento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="nroDocumento">Nro. Documento:</label>
          <input
            type="text"
            id="nroDocumento"
            name="nroDocumento"
            value={formData.nroDocumento}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="primerNombre">Primer Nombre:</label>
          <input
            type="text"
            id="primerNombre"
            name="primerNombre"
            value={formData.primerNombre}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="segundoNombre">Segundo Nombre:</label>
          <input
            type="text"
            id="segundoNombre"
            name="segundoNombre"
            value={formData.segundoNombre}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="apellidos">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="genero">Género:</label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div>
          <label htmlFor="correoElectronico">Correo Electrónico:</label>
          <input
            type="email"
            id="correoElectronico"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="celular">Celular:</label>
          <input
            type="text"
            id="celular"
            name="celular"
            value={formData.celular}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="foto">Foto (binario):</label>
          <input
            type="file"  /* Utiliza un input de tipo 'file' para cargar una imagen binaria */
            id="foto"
            name="foto"
            // No es necesario utilizar 'value' y 'onChange' para campos de archivo
            // En su lugar, puedes manejar la carga de la imagen en una función separada
          />
        </div>
          <button type="submit">Guardar</button>
        </form>
      </div>
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
