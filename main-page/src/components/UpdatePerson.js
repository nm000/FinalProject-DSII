import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function validarFormatoFecha(fecha) {
  // Define una expresión regular para el formato "dd-mm-aaaa"
  const formatoFecha = /^(\d{2})-(\d{2})-(\d{4})$/;

  // Comprueba si la fecha coincide con el formato
  if (!formatoFecha.test(fecha)) {
    return false; // La fecha no cumple con el formato
  }

  // Extrae los componentes de la fecha
  const [, dia, mes, anio] = fecha.match(formatoFecha);

  // Convierte los componentes a números enteros
  const diaNumero = parseInt(dia, 10);
  const mesNumero = parseInt(mes, 10);
  const anioNumero = parseInt(anio, 10);

  // Valida que los componentes sean válidos
  if (
    diaNumero < 1 || diaNumero > 31 ||
    mesNumero < 1 || mesNumero > 12 ||
    anioNumero < 1900 // Puedes ajustar el año mínimo según tus necesidades
  ) {
    return false; // La fecha no es válida
  }

  // Puedes realizar validaciones adicionales según tus requisitos

  // La fecha cumple con el formato y es válida
  return true;
}

function validarCorreoElectronico(correo) {
  // Define una expresión regular para validar el formato de correo electrónico
  const formatoCorreo = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // Comprueba si el correo electrónico coincide con el formato
  return formatoCorreo.test(correo);
}

export const UpdatePerson = () => {

  // Inicializar todas las variables de la persona
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

  // Inicializar variable que contendrá todos los datos de la persona
  const [personaData, setPersonaData] = useState({});
  const navigate = useNavigate();
  // Obtener la URL de la página
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // En este punto, en la URL habrá como http://localhost:3000/update?datos=97544527
  // Esta función obtiene lo que sea que va después de datos= 
  const datos = urlParams.get('datos'); // Obtiene la IDENTIFICACIÓN desde la URL

  // La función que maneja la solicitud GET y carga los datos en los campos de entrada
  const getPersonaData = async () => {
    try {

      // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
      const persona = await fetch(`http://localhost:8000/${datos}`);

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



  async function submit(e) {

    // Esto va siempre
    e.preventDefault();

    // Envío del método PUT para realizar el UPDATE
    // Envío del método POST para realizar el CREATE con los datos
    if (tipoDocumento === 'Tarjeta de identidad' || tipoDocumento === 'Cedula') {
      if (typeof numDocumento === "number" && numDocumento.length <= 10) {
        if (typeof primerNombre != "number" && primerNombre.length <= 30) {
          if (typeof segundoNombre != "number" && segundoNombre.length <= 30) {
            if (typeof apellidos != "number" && apellidos.length <= 60) {
              if (validarFormatoFecha(fechaNacimiento)) {
                if (genero === 'Masculino' || genero === 'Femenino' || genero === 'No binario' || genero === 'Prefiero no responder') {
                  if (validarCorreoElectronico(correoElectronico)) {
                    if (typeof celular === "number" && celular.length === 10) {

                      // falta la foto
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

                      // Esto lo único que hace es que retrocede uno a la página
                      // Por ejemplo cuando el create se hace correctamente, te devuelve a la página del menú de opciones  
                      await navigate(-1);


                    } else {
                      // celular invalido
                    }
                  } else {
                    // correo no valido
                  }
                } else {
                  // genero no valido
                }
              } else {
                // formato invalido (debe ser dd-mm-aaaa)
              }
            } else {
              console.log('Digite apellidos sin números y menos de 60 caracteres')
            }
          } else {
            console.log('Digite un segundo nombre sin número y de menos de 30 caracteres')
          }
        } else {
          console.log('Digite un nombre sin número y de menos de 30 caracteres')
        }
      } else {
        console.log('digite un número no mayor de 10 caracteres')
      }
    } else {
      console.log('digite tipo de doc valido')
    }

  }

  // HTML DEL CÓDIGO
  return <div className='container'>
    <form>
      <div>
        <label htmlFor="tipoDocumento">Tipo de Documento:</label>
        <select
          id="tipoDocumento"
          name="tipoDocumento"
          onChange={e => setTipoDocumento(e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="Tarjeta de identidad">Tarjeta de identidad</option>
          <option value="Cedula">Cédula</option>
        </select>

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
          pattern="\d{2}-\d{2}-\d{4}"
          placeholder="dd-mm-aaaa"
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
          <option value="No binario">No binario</option>
          <option value="Prefiero no responder">Prefiero no responder</option>
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

      <button type="submit" onClick={submit}>Submit</button>

    </form>
  </div>
} 