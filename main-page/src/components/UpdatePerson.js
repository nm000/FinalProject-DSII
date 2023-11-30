import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mod from '../styles/style.module.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

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

function validarStringSinNumeros(texto) {
  const patronSinNumeros = /^\D+$/;
  return patronSinNumeros.test(texto);
}

function verificarTipoDocumentoYEdad(fechaNacimiento, tipoDocumento) {
  // Convertir la fecha de nacimiento al objeto Date
  const partesFecha = fechaNacimiento.split("-");
  const fechaNacimientoObj = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);

  // Calcular la edad
  const hoy = new Date();
  var edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();

  if (mesActual < fechaNacimientoObj.getMonth() || (mesActual === fechaNacimientoObj.getMonth() && diaActual < fechaNacimientoObj.getDate())) {
    // Aún no ha cumplido años en este año
    edad--;
  }

  // Verificar la edad y el tipo de documento
  if (edad < 18 && (tipoDocumento === 'Cedula de ciudadania' || tipoDocumento === 'Cedula de extranjeria')) {
    return false;
  } else {
    return true;
  }
}

const formatearFechaVisual = (fecha) => {
  const [dia, mes, anio] = fecha.split('-');
  return `${anio}-${mes}-${dia}`;
};


export const UpdatePerson = () => {

  // Inicializar todas las variables de la persona
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numDocumento, setnumDocumento] = useState(0);
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [celular_input, setCelular_input] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [FotoDisplay, setFotoDisplay] = useState(null);

  // Inicializar variable que contendrá todos los datos de la persona
  const [personaData, setPersonaData] = useState({});

  // Obtener la URL de la página
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const navigate = useNavigate();
  // En este punto, en la URL habrá como http://localhost:3000/update?datos=97544527
  // Esta función obtiene lo que sea que va después de datos= 
  const datos = urlParams.get('datos'); // Obtiene la IDENTIFICACIÓN desde la URL

  // La función que maneja la solicitud GET y carga los datos en los campos de entrada
  const getPersonaData = async () => {
    try {

      // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
      const persona = await fetch(`http://localhost:8003/persona/${datos}`);

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
        setCelular_input(personaData.celular);
        setSelectedFile(personaData.foto);
        setFotoDisplay(personaData.foto);

        console.log(personaData.foto)
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

  function contieneSoloNumeros(cadena) {
    // Utilizar una expresión regular para verificar si la cadena contiene solo números
    return /^[0-9]+$/.test(cadena);
  }

  async function submit(e) {

    // Esto va siempre
    e.preventDefault();

    // Envío del método PUT para realizar el UPDATE
    // Envío del método POST para realizar el CREATE con los datos

    if (tipoDocumento === 'Tarjeta de identidad' || tipoDocumento === 'Cedula de ciudadania' || tipoDocumento === 'Cedula de extranjeria') {
      if (typeof numDocumento === "number" && numDocumento.toString().length <= 10 && !isNaN(numDocumento)) {
        if (validarStringSinNumeros(primerNombre) && primerNombre.replace(/\s/g, "").length <= 30) {
          if (validarStringSinNumeros(segundoNombre) && segundoNombre.replace(/\s/g, "").length <= 30) {
            if (validarStringSinNumeros(apellidos) && apellidos.replace(/\s/g, "").length <= 60) {
              if (validarFormatoFecha(fechaNacimiento)) {
                if (verificarTipoDocumentoYEdad(fechaNacimiento, tipoDocumento)) {
                  if (genero === 'Masculino' || genero === 'Femenino' || genero === 'No binario' || genero === 'Prefiero no responder') {
                    if (validarCorreoElectronico(correoElectronico)) {
                      if (celular_input !== '' && contieneSoloNumeros(celular_input)) {
                        const celular = parseInt(celular_input)
                        if (typeof celular === "number" && celular.toString().length === 10 && !isNaN(celular) && celular >= 0) {
                          if (selectedFile2 != null) {
                            const fileInput = document.getElementById('foto');  // Reemplaza con tu método para obtener el input de tipo file

                            const reader = new FileReader();

                            reader.onload = async function () {
                              try {
                                const foto = reader.result.split(',')[1];  // Obtiene la parte de datos en base64

                                // falta la foto
                                const response = await fetch(`http://localhost:8003/${datos}`, {
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
                                    foto
                                  }),
                                });

                                // Aquí puedes manejar la respuesta, por ejemplo, verificar el estado de la respuesta
                                if (!response.ok) {
                                  throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                                }

                                Swal.fire({
                                  title: "¡Bien hecho!",
                                  text: "¡Se ha actualizado exitosamente!",
                                  icon: "success"
                                });

                              } catch (error) {
                                // Aquí manejas cualquier error que ocurra durante la solicitud
                                if (error.message.includes('405')) {
                                  Swal.fire({
                                    title: "¿Y los cambios?",
                                    text: "¡No ha realizado ningún cambio!",
                                    icon: "question"
                                  });
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Lo sentimos...",
                                    text: "Hubo un error del lado del servidor"
                                  });
                                }
                              }
                            }

                            // Lee el contenido de la imagen como base64
                            reader.readAsDataURL(fileInput.files[0]);
                            // Esto lo único que hace es que retrocede uno a la página
                            // Por ejemplo cuando el create se hace correctamente, te devuelve a la página del menú de opciones  
                          } else {
                            // falta la foto
                            try {
                              const foto = personaData.foto

                              // falta la foto
                              const response = await fetch(`http://localhost:8003/${datos}`, {
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
                                  foto
                                }),
                              });

                              // Aquí puedes manejar la respuesta, por ejemplo, verificar el estado de la respuesta
                              if (!response.ok) {
                                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                              }
                              Swal.fire({
                                title: "¡Bien hecho!",
                                text: "¡Se ha actualizado exitosamente!",
                                icon: "success"
                              });
                            } catch (error) {
                              // Aquí manejas cualquier error que ocurra durante la solicitud
                              if (error.message.includes('405')) {
                                Swal.fire({
                                  title: "¿Y los cambios?",
                                  text: "¡No ha realizado ningún cambio!",
                                  icon: "question"
                                });
                              } else {
                                Swal.fire({
                                  icon: "error",
                                  title: "Lo sentimos...",
                                  text: "Hubo un error del lado del servidor"
                                });
                              }
                            }
                          };
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Digite un número celular de 10 dígitos exactamente"
                          });
                        }
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "No digite letras en su celular ni lo deje vacío"
                        });
                      }
                    } else {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Digite un correo válido"
                      });
                    }
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Seleccione un género válido"
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Un menor de edad no puede tener cédula"
                  });
                }
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Seleccione una fecha válida y dentro del rango permitido"
                });
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Sus apellidos deben tener 60 caracteres o menos, sin números"
              });
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Su segundo nombre debe tener 30 caracteres o menos, sin números"
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Su nombre debe tener 30 caracteres o menos, sin números"
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Su documento debe tener 10 dígitos o menos, sin letras"
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Digite un tipo de documento válido"
      });
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Verificar si se seleccionó un archivo
    if (file) {
      // Verificar el tamaño del archivo (en bytes)
      const fileSize = file.size;
      const maxSize = 2 * 1024 * 1024; // 2 MB en bytes

      if (fileSize > maxSize) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "La imagen seleccionada supera el tamaño máximo permitido de 2 MB."
        });
        // Limpiar el campo de entrada de archivos
        e.target.value = null;
        setSelectedFile2(null);
        return;
      }

      // Verificar el tipo de archivo
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedFormats.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Formato de archivo no válido. Solo se permiten archivos JPEG, PNG o GIF."
        });
        // Limpiar el campo de entrada de archivos
        e.target.value = null;
        setSelectedFile2(null);
        return;
      }

      const reader = new FileReader();

      reader.onload = async function () {

        const foto = reader.result.split(',')[1];  // Obtiene la parte de datos en base64

        setFotoDisplay(foto)

      }

      // Lee el contenido de la imagen como base64
      reader.readAsDataURL(file);


      setSelectedFile2(file);
    }
  };


  // HTML DEL CÓDIGO
  return <div className={mod.containerform}>
    <div className={mod.information}>
      <div className={mod.infochilds}>
        <h2 style={{ marginBottom: '30px' }}>Bienvenido</h2>
        <div>
          <img
            src={`data:image/png;base64,${FotoDisplay}`}
            alt="Foto de la persona"
            style={{ maxWidth: '300px', maxHeight: '400px', borderRadius: '20%', objectFit: 'cover' }}
          />
        </div>
        <p style={{ marginTop: '20px' }}>¿Quieres hacer algo más con tu información?</p>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'create', ports: ['8002', '8004'] }])} >
          <input type="button" value="Añadir" />
        </Link>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'delete', ports: ['8001', '8004'] }])} >
          <input type="button" value="Borrar" />
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/" >
          <input type="button" value="Inicio" />
        </Link>
      </div>
    </div>
    <div className={mod.forminformation}>
      <div className={mod.forminformationchilds}>
        <h2 style={{ marginTop: '20px' }}>Modificar Información</h2>
        <div className={mod.icons}>
          <a onClick={() => validateMicroservice([{ endpoint: 'searchperson', ports: ['8000', '8004'] }])} >
            <box-icon type='solid' name='a'></box-icon>
          </a>
          <a onClick={() => validateMicroservice([{ endpoint: 'searchperson', ports: ['8000', '8004'] }])} >
            <i className='bx bx-search'></i>
          </a>
        </div>
        <p>o consultar tu información</p>

        <form className={mod.form}>
          <label >
            <i className='bx bxs-user-account'></i>
            <select
              id="tipoDocumento" name="tipoDocumento" onChange={(e) => setTipoDocumento(e.target.value)} value={tipoDocumento}
            >
              <option value="Seleccione el tipo de documento">Seleccione el tipo de documento</option>"
              <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              <option value="Cedula de ciudadania">Cédula de ciudadanía</option>
              <option value="Cedula de extranjeria">Cédula de extranjería</option>
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
              onChange={e => setnumDocumento(parseInt(e.target.value))}
              disabled

            />
          </label>
          <label>
            <i className='bx bx-street-view'></i>
            <input
              type="text"
              id="primerNombre"
              name="primerNombre" placeholder="Primer nombre"
              defaultValue={personaData.primerNombre}
              onChange={(e) => setPrimerNombre(e.target.value)}
            />
          </label>
          <label>
            <i className='bx bx-street-view'></i>
            <input
              type="text"
              id="segundoNombre"
              name="segundoNombre" placeholder="Segundo nombre"
              defaultValue={personaData.segundoNombre}
              onChange={(e) => setSegundoNombre(e.target.value)}
            />
          </label>
          <label >
            <i className='bx bx-user'></i>
            <input

              type="text"
              id="apellidos"
              name="apellidos" placeholder="Apellidos"
              defaultValue={personaData.apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </label>
          <label >
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento" placeholder="Fecha Nacimiento"
              pattern="\d{2}-\d{2}-\d{4}"
              onChange={(e) => {
                const inputDate = e.target.value;
                const formattedDate = inputDate
                  .split('-')
                  .reverse()
                  .join('-');
                setFechaNacimiento(formattedDate);
              }}

              max={(new Date()).toISOString().split('T')[0]}
              min="1900-01-01"
              value={fechaNacimiento ? formatearFechaVisual(fechaNacimiento) : ""}
            />
          </label>
          <label >
            <i className='bx bx-male-female'></i>
            <select
              id="genero"
              name="genero"
              onChange={(e) => setGenero(e.target.value)}
              value={genero}
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
              onChange={(e) => setCorreoElectronico(e.target.value)}
              defaultValue={personaData.correoElectronico}
            /></label>

          <label >
            <i className='bx bx-phone'></i>
            <input
              type="text"
              id="celular"
              name="celular"
              placeholder="Num Celular"
              onChange={(e) => setCelular_input(e.target.value)}
              defaultValue={personaData.celular}
            /></label>

          <label>
            <i className='bx bxs-user-rectangle'></i>
            <div>
              <input
                type="file"
                id="foto"
                name="foto"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile2 && <p>Archivo seleccionado: {selectedFile2.name}</p>}
          </label>

          <input type="submit" value="Aceptar" onClick={submit} />
        </form>
      </div>
    </div>
  </div>
} 