import React, { useState , useEffect } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

export const UpdatePerson = () => {

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
    const location = useLocation();

    const [personaData, setPersonaData] = useState({});

    // Página de destino
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const datos = urlParams.get('datos'); // Obtiene la cadena JSON de la URL

    const navigate = useNavigate();

    // La función que maneja la solicitud GET y carga los datos en los campos de entrada
    const getPersonaData = async () => {
      try {
             
        // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
        const response = await fetch(`http://localhost:8000/${datos}`);

        if (response.ok) {
          const personaData = await response.json();
          console.log(personaData);             
     
          setPersonaData(personaData);
          
          setTipoDocumento(personaData.tipoDocumento);
          setnumDocumento(personaData.numDocumento);
          setPrimerNombre(personaData.primerNombre);
          setSegundoNombre(personaData.segundoNombre);
          setApellidos(personaData.apellidos);
          setFechaNacimiento(personaData.fechaNacimiento);
          setGenero(personaData.genero);
          setCorreoElectronico(personaData.correoElectronico);
          setCelular(personaData.celular);
          setSelectedFile(personaData.foto);

        } else {
          console.error('Error en la solicitud HTTP');
        }
      } catch (error) {
        console.error('Ocurrió un error:', error);
      }
    };
  
    useEffect(() => {
      // Llama a la función para obtener los datos cuando se monta el componente
      getPersonaData();
    }, []);



    async function submit(e) {

        e.preventDefault();

        await fetch(`http://localhost:8003/${datos}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipoDocumento,
                primerNombre,
                segundoNombre,
                apellidos,
                fechaNacimiento,
                genero,
                correoElectronico,
                celular,
                foto // Aquí va la foto (bytes)
            }),
        });
        console.log(JSON.stringify({
            tipoDocumento,
            primerNombre,
            segundoNombre,
            apellidos,
            fechaNacimiento,
            genero,
            correoElectronico,
            celular,
            foto // Aquí va la foto (bytes)
        }),)
        
    }
    
    return <div className='container'>
    <form>
    <div>
      <label htmlFor="tipoDocumento">Tipo de Documento:</label>
      <input
        type="text"
        id="tipoDocumento"
        name="tipoDocumento"
        defaultValue={personaData.tipoDocumento}
        onChange={e => setTipoDocumento(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="nroDocumento">Nro. Documento:</label>
      <input
        type="text"
        id="nroDocumento"
        name="nroDocumento"
        defaultValue={personaData.numDocumento}
        onChange={e => setnumDocumento(e.target.value)}
        disabled
      />
    </div>
    <div>
      <label htmlFor="primerNombre">Primer Nombre:</label>
      <input
        type="text"
        id="primerNombre"
        name="primerNombre"
        defaultValue={personaData.primerNombre}
        onChange={e => setPrimerNombre(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="segundoNombre">Segundo Nombre:</label>
      <input
        type="text"
        id="segundoNombre"
        name="segundoNombre"
        defaultValue={personaData.segundoNombre}
        onChange={e => setSegundoNombre(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="apellidos">Apellidos:</label>
      <input
        type="text"
        id="apellidos"
        name="apellidos"
        defaultValue={personaData.apellidos}
        onChange={e => setApellidos(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
      <input
        type="date"
        id="fechaNacimiento"
        name="fechaNacimiento"
        defaultValue={personaData.fechaNacimiento}
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
        defaultValue={personaData.correoElectronico}
        onChange={e => setCorreoElectronico(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="celular">Celular:</label>
      <input
        type="text"
        id="celular"
        name="celular"
        defaultValue={personaData.celular}
        onChange={e => setCelular(e.target.value)}
      />
    </div>
    <div>
          <label htmlFor="foto">Foto (binario):</label>
          <input
            type="text"  /* Utiliza un input de tipo 'file' para cargar una imagen binaria */
            id="foto"
            name="foto"
            defaultValue={personaData.foto}
            onChange={e => setSelectedFile(e.target.value)}
            // No es necesario utilizar 'value' y 'onChange' para campos de archivo
            // En su lugar, puedes manejar la carga de la imagen en una función separada
          />
        </div>

    <button type="submit"onClick={submit}>Submit</button>

    </form>
  </div>
}