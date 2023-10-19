import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';


export const CreatePerson = () => {

    const [tipoDocumento, setTipoDocumento] = useState('');
    const [numDocumento, setnumDocumento] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [celular, setCelular] = useState('');
    const [foto, setSelectedFile] = useState('');
    const navigate = useNavigate();

    const submit = async e => {
        console.log("hola")
        e.preventDefault();
        
        await fetch('http://localhost:8000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              numDocumento, // Aquí va el número de documento (int)
              tipoDocumento, // Aquí va el tipo de documento (str)
              primerNombre, // Aquí va el primer nombre (str)
              segundoNombre, // Aquí va el segundo nombre (str)
              apellidos, // Aquí van los apellidos (str)
              fechaNacimiento, // Aquí va la fecha de nacimiento (str)
              genero, // Aquí va el género (str)
              correoElectronico, // Aquí va el correo electrónico (str)
              celular, // Aquí va el celular (int)
              foto // Aquí va la foto (bytes)
            }),
          });

        await navigate(-1);
    }
    
    return <div className='container'>
    <form>
    <div>
      <label htmlFor="tipoDocumento">Tipo de Documento:</label>
      <input
        type="text"
        id="tipoDocumento"
        name="tipoDocumento"
        onChange={e => setTipoDocumento(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="nroDocumento">Nro. Documento:</label>
      <input
        type="text"
        id="nroDocumento"
        name="nroDocumento"
        onChange={e => setnumDocumento(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="primerNombre">Primer Nombre:</label>
      <input
        type="text"
        id="primerNombre"
        name="primerNombre"
        onChange={e => setPrimerNombre(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="segundoNombre">Segundo Nombre:</label>
      <input
        type="text"
        id="segundoNombre"
        name="segundoNombre"
        onChange={e => setSegundoNombre(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="apellidos">Apellidos:</label>
      <input
        type="text"
        id="apellidos"
        name="apellidos"
        onChange={e => setApellidos(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
      <input
        type="date"
        id="fechaNacimiento"
        name="fechaNacimiento"
        onChange={e => setFechaNacimiento(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="genero">Género:</label>
      <select
        id="genero"
        name="genero"
        onChange={e => setGenero(e.target.value)}
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
        onChange={e => setCorreoElectronico(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="celular">Celular:</label>
      <input
        type="text"
        id="celular"
        name="celular"
        onChange={e => setCelular(e.target.value)}
      />
    </div>
    <div>
          <label htmlFor="foto">Foto (binario):</label>
          <input
            type="text"  /* Utiliza un input de tipo 'file' para cargar una imagen binaria */
            id="foto"
            name="foto"
            onChange={e => setSelectedFile(e.target.value)}
            // No es necesario utilizar 'value' y 'onChange' para campos de archivo
            // En su lugar, puedes manejar la carga de la imagen en una función separada
          />
        </div>

    <button type="submit"onClick={submit}>Submit</button>

    </form>
  </div>
}