import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mod from '../styles/style.module.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const SelectPerson = () => {

  // Inicializar todas las variables de la persona
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numDocumento, setnumDocumento] = useState(0);
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [celular, setCelular] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  // Inicializar variable que contendrá todos los datos de la persona
  const [personaData, setPersonaData] = useState({});

  // Obtener la URL de la página
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const navigate = useNavigate();
  // En este punto, en la URL habrá como http://localhost:3000/update?datos=97544527
  // Esta función obtiene lo que sea que va después de datos= 
  const datos = urlParams.get('datos'); // Obtiene la IDENTIFICACIÓN desde la URL

  async function validateMicroservice(microservices) {
    try {
      for (const { endpoint, ports } of microservices) {
        for (const port of ports) {
          const response = await fetch(`http://localhost:${port}/disp`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
          }

          const repuesta = await response.json();

          if (!repuesta.disponibilidad) {
            Swal.fire({
              icon: "error",
              title: "Lo sentimos...",
              text: `Este servicio no está disponible actualmente. Inténtalo más tarde`,
            });
            return;  // Salir de la función si un microservicio no está disponible
          }
        }
      }

      // Si todos los microservicios están disponibles, redirige a la página correspondiente
      navigate(`/${microservices[0].endpoint}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lo sentimos...",
        text: `Este servicio no está disponible actualmente. Inténtalo más tarde`,
      });
    }
  }

  // La función que maneja la solicitud GET y carga los datos en los campos de entrada
  const getPersonaData = async () => {
    try {

      // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
      const persona = await fetch(`http://localhost:8000/persona/${datos}?validez=false`);

      if (persona.ok) {
        const personaData = await persona.json();

        // colocar en personaData todos los datos de la persona
        setPersonaData(personaData);

        // Colocar a cada variable el valor actual de la persona
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

  const formatearFechaVisual = (fecha) => {
    const [dia, mes, anio] = fecha.split('-');
    return `${anio}-${mes}-${dia}`;
  };

  // Solo un HTML para el input del num de documento
  return <div className={mod.containerform}>
    <div className={mod.information}>
      <div className={mod.infochilds}>
        <h2 style={{ marginBottom: '30px' }}>Bienvenido(a), {personaData.primerNombre}</h2>
        <div>
          <img
            src={`data:image/png;base64,${personaData.foto}`}
            alt="Foto de la persona"
            style={{ maxWidth: '300px', maxHeight: '400px', borderRadius: '20%', objectFit: 'cover' }}
          />
        </div>
        <p>¿Quieres hacer algo más?</p>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'create', ports: ['8002'] }])}>
          <input type="button" value="Añadir" />
        </Link>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'delete', ports: ['8001'] }])}>
          <input type="button" value="Borrar" />
        </Link>
      </div>
    </div>
    <div className={mod.forminformation}>
      <div className={mod.forminformationchilds}>
        <h2 style={{ marginTop: '20px' }}>Consultar Información</h2>
        <div className={mod.icons}>
          <a href="/select">
            <box-icon type='solid' name='a'></box-icon>
          </a>
          <a onClick={() => validateMicroservice([{ endpoint: 'search', ports: ['8003'] }])}>
            <i className='bx bx-edit'></i>
          </a>
        </div>
        <p>o modificar tu información</p>

        <form className={mod.form}>
          <label >
            <i className='bx bxs-user-account'></i>
            <select
              id="tipoDocumento" name="tipoDocumento" value={tipoDocumento}
              readOnly
            >
              <option value="Seleccione el tipo de documento">Seleccione el tipo de documento</option>"
              <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              <option value="Cedula">Cédula</option>
            </select>
          </label>
          <label>
            <i className='bx bxs-id-card'></i>
            <input
              type="number"
              id="nroDocumento"
              name="nroDocumento"
              placeholder={numDocumento}
              defaultValue={personaData.numDocumento}
              readOnly
            />
          </label>
          <label>
            <i className='bx bx-street-view'></i>
            <input
              type="text"
              id="primerNombre"
              name="primerNombre" placeholder="Primer nombre"
              defaultValue={personaData.primerNombre}
              readOnly
            />
          </label>
          <label>
            <i className='bx bx-street-view'></i>
            <input
              type="text"
              id="segundoNombre"
              name="segundoNombre" placeholder="Segundo nombre"
              defaultValue={personaData.segundoNombre}
              readOnly
            />
          </label>
          <label >
            <i className='bx bx-user'></i>
            <input

              type="text"
              id="apellidos"
              name="apellidos" placeholder="Apellidos"
              defaultValue={personaData.apellidos}
              readOnly
            />
          </label>
          <label >
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento" placeholder="Fecha Nacimiento"
              pattern="\d{2}-\d{2}-\d{4}"

              max={(new Date()).toISOString().split('T')[0]}
              min="1900-01-01"
              readOnly
              value={fechaNacimiento ? formatearFechaVisual(fechaNacimiento) : ""}
            />
          </label>
          <label >
            <i className='bx bx-male-female'></i>
            <select
              id="genero"
              name="genero"
              value={genero}
              readOnly
            >
              <option value="Seleccione su género">Seleccione su género</option>"
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No binario">No binario</option>
              <option value="Prefiero no responder">Prefiero no responder</option>
            </select>
          </label>
          <label >
            <i className='bx bx-envelope'></i>
            <input
              type="email"
              id="correoElectronico"
              name="correoElectronico" placeholder="Correo Electrónico"
              readOnly
              defaultValue={personaData.correoElectronico}
            /></label>

          <label >
            <i className='bx bx-phone'></i>
            <input
              type="number"
              id="celular"
              name="celular"
              placeholder="Num Celular"
              readOnly
              defaultValue={personaData.celular}
            /></label>
        </form>
      </div>
    </div>
  </div>
}