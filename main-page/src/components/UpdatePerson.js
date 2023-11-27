import React, { useState, useEffect } from 'react';
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
  const edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();

  if (mesActual < fechaNacimientoObj.getMonth() || (mesActual === fechaNacimientoObj.getMonth() && diaActual < fechaNacimientoObj.getDate())) {
    // Aún no ha cumplido años en este año
    edad--;
  }

  // Verificar la edad y el tipo de documento
  if (edad < 18 && tipoDocumento === 'Cedula') {
    return false;
  } else {
    return true;
  }
}


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
  const [celular, setCelular] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  // Inicializar variable que contendrá todos los datos de la persona
  const [personaData, setPersonaData] = useState({});

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
      const persona = await fetch(`http://localhost:8000/persona/${datos}`);

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
    console.log(selectedFile)
    if (tipoDocumento === 'Tarjeta de identidad' || tipoDocumento === 'Cedula') {
      if (typeof numDocumento === "number" && numDocumento.toString().length <= 10) {
        if (validarStringSinNumeros(primerNombre) && primerNombre.length <= 30) {
          if (validarStringSinNumeros(segundoNombre) && segundoNombre.length <= 30) {
            if (validarStringSinNumeros(apellidos) && apellidos.length <= 60) {
              if (validarFormatoFecha(fechaNacimiento)) {
                if (verificarTipoDocumentoYEdad(fechaNacimiento, tipoDocumento)) {
                  if (genero === 'Masculino' || genero === 'Femenino' || genero === 'No binario' || genero === 'Prefiero no responder') {
                    if (validarCorreoElectronico(correoElectronico)) {
                      if (typeof celular === "number" && celular.toString().length === 10) {
                        if (selectedFile != null) {
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
                                text: "¡Te has registrado exitosamente!",
                                icon: "success"
                              });

                            } catch (error) {
                              // Aquí manejas cualquier error que ocurra durante la solicitud
                              Swal.fire({
                                icon: "error",
                                title: "Lo sentimos...",
                                text: "Hubo un error del lado del servidor"
                              });
                            }

                            // Esto lo único que hace es que retrocede uno a la página
                            // Por ejemplo cuando el create se hace correctamente, te devuelve a la página del menú de opciones  
                          };

                          // Lee el contenido de la imagen como base64
                          reader.readAsDataURL(fileInput.files[0]);

                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Escoja una foto"
                          });
                        }
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
        setSelectedFile(null);
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
        setSelectedFile(null);
        return;
      }

      // Si pasó las validaciones, puedes hacer algo con el archivo, como almacenarlo en el estado
      setSelectedFile(file);
    }
  };


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
          type="number"
          id="nroDocumento"
          name="nroDocumento"
          defaultValue={personaData.numDocumento}
          onChange={e => setnumDocumento(parseInt(e.target.value))}
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
          onChange={e => {
            const inputDate = e.target.value; // Obtiene la fecha en formato "yyyy-mm-dd"
            const formattedDate = inputDate.split('-').reverse().join('-'); // Convierte a "dd-mm-yyyy"
            setFechaNacimiento(formattedDate);
          }}

          max={(new Date()).toISOString().split('T')[0]}
          min="1900-01-01"

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
          type="number"
          id="celular"
          name="celular"
          defaultValue={personaData.celular}
          onChange={e => setCelular(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="foto">Foto (binario):</label>
        <input
          type="file"
          id="foto"
          name="foto"
          defaultValue={personaData.foto}
          onChange={handleFileChange}
        />
        {/* Puedes mostrar información adicional sobre el archivo seleccionado si es necesario */}
        {selectedFile && <p>Archivo seleccionado: {selectedFile.name}</p>}
      </div>

      <button type="submit" onClick={submit}>Submit</button>

    </form>
  </div>
} 