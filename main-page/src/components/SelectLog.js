import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Log from '../styles/LogStyle.module.css';
import Modal from 'react-modal';
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

export const LogConsole = () => {

  // Acá solo se usa el num de documento
  // Esta página solo muestra un input para el documento, que se envía después a la página de update
  const [numDocumento_input, setnumDocumento_input] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');
  const [fecha, setfecha] = useState('');

  // Inicializar variable que contendrá todos los datos de la persona
  const [logs, setLogs] = useState({});

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const openModal = (log) => {
    setSelectedLog(log);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedLog(null);
    setModalIsOpen(false);
  };

  function contieneSoloNumeros(cadena) {
    // Utilizar una expresión regular para verificar si la cadena contiene solo números
    return /^[0-9]+$/.test(cadena);
  }


  
  const submit = async e => {

    e.preventDefault();
    console.log(numDocumento_input, numDocumento_input === '', contieneSoloNumeros(numDocumento_input))
    // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
    if (numDocumento_input === '' || contieneSoloNumeros(numDocumento_input)) {
      const numDoc = parseInt(numDocumento_input)
      if (tipoDoc === 'Tarjeta de identidad' || tipoDoc === 'Cedula de ciudadania' || tipoDoc === 'Cedula de extranjeria' || tipoDoc === '') {
        if ((typeof numDoc === "number" && numDoc.toString().length <= 10 && numDoc >= 0) || numDoc == '' || isNaN(numDoc)) {
          try {
            // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS

            const response = await fetch(`http://localhost:8004/log?tipoDoc=${tipoDoc}&numDoc=${numDoc}&fecha=${fecha}`);

            if (response.ok) {
              const logData = await response.json();

              // colocar en personaData todos los datos de la persona
              setLogs(logData);
            } else {
              console.error('Error en la solicitud HTTP');
            }
          } catch (error) {
            console.error('Ocurrió un error:', error);
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
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No digite letras en el documento"
      });
    }
  }

  useEffect(() => {
    // Llamado a /log cuando el componente se monta
    submit({ preventDefault: () => { } });
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  // Solo un HTML para el input del num de documento
  return (
    <div>
      <div className={Log.img}></div>
      <div className={Log.containerformlog} style={{ zIndex: 1 }}>
        <div className={Log.informationlog}>
          <div className={Log.infochildslog}>
            <h2>CONSULTA DE REGISTRO</h2>
          </div>
        </div>
        <div className={Log.forminformationlog}>
          <div className={Log.forminformationchildslog}>
            <form className={Log.formlog}>
              <h2 style={{ marginBottom: '20px', marginTop: '10px' }}>Tipo De Documento</h2>
              <label >
                <i className='bx bxs-user-account'></i>
                <select
                  id="tipoDocumento" name="tipoDocumento" onChange={(e) => setTipoDoc(e.target.value)}
                >
                  <option value="">Seleccione el tipo de documento</option>"
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                  <option value="Cedula de ciudadania">Cédula de ciudadanía</option>
                  <option value="Cedula de extranjeria">Cédula de extranjería</option>
                </select>
              </label>
              <input type="submit" onClick={submit} value="Buscar" />
            </form>
            <form className={Log.formlog}>
              <h2 style={{ marginBottom: '20px', marginTop: '10px' }}>Documento</h2>
              <label>
                <i className='bx bxs-id-card'></i>
                <input
                  type="text"
                  id="numDocumento"
                  name="numDocumento" placeholder="Documento"
                  onChange={(e) => setnumDocumento_input(e.target.value)}
                />
              </label>
            </form>
            <form className={Log.formlog}>
              <h2 style={{ marginBottom: '20px', marginTop: '10px' }}>Fecha Registro</h2>
              <label >
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento" placeholder="Fecha Nacimiento"
                  onChange={(e) => {
                    const inputDate = e.target.value;
                    setfecha(inputDate);
                  }}
                  max={(new Date()).toISOString().split('T')[0]}
                  min="1900-01-01"
                />
              </label>
            </form>
          </div>
          <div className={Log.forminformationchildrenlog}>
            <section>
              <div className={Log.tblheader}>
                <table cellpadding="0" cellspacing="0" border="0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tipo Doc</th>
                      <th>Documento</th>
                      <th>Fecha</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                </table>
              </div>
              {logs && logs.length > 0 ? (
                <div className={Log.tblcontent}>
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.idLog}>
                          <td>
                            {log.idLog}
                            <Link to="#" onClick={() => openModal(log)} style={{ marginLeft: '5px' }}>
                              <i className='bx bx-search'></i>
                            </Link>
                          </td>
                          <td>{log.tipoDocumentoPersona}</td>
                          <td>{log.documentoPersona}</td>
                          <td>{log.dateLog}</td>
                          <td>{log.accionLog}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={{
                      overlay: {
                        zIndex: 2,
                        position: 'fixed',
                        display: 'flex',
                        justifyContent: 'center', // Center the modal horizontally
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      },
                      content: {
                        zIndex: 1,
                        margin: '0',
                        padding: '20px',
                        width: 'auto',
                        maxWidth: '40%',
                        maxHeight: '80%',
                        overflow: 'auto',
                        marginLeft: 'auto', 
                        marginRight: 'auto', 
                        backgroundColor: '#F0F0F0'
                      },
                    }}>
                    {selectedLog && (
                      <div style={{ display: 'flex', padding:'0', flexDirection: 'column', textAlign: 'center', margin: 'auto', marginTop: '10px', width: 'auto', maxWidth: '500px'}}>
                        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px'}}>
                          <h2 style={{ padding: '10px '}}> ID </h2>
                          <p style={{ fontSize: '20px' }}>{selectedLog.idLog}</p>
                        </div>
                        <div  style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                          <h2 style={{ padding: '10px '}}>Tipo de Documento </h2>
                          <p style={{ fontSize: '20px' }}>{selectedLog.tipoDocumentoPersona}</p>
                        </div>
                        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                          <h2 style={{ padding: '10px '}}>Documento </h2>
                          <p style={{ fontSize: '20px' }}>{selectedLog.documentoPersona}</p>
                        </div>
                        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                          <h2 style={{ padding: '10px '}}>Fecha </h2>
                          <p style={{ fontSize: '20px' }}>{selectedLog.dateLog}</p>
                        </div>
                        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                          <h2 style={{ padding: '10px '}}>Acción realizada </h2>
                          <p style={{ fontSize: '20px' }}>{selectedLog.accionLog}</p>
                        </div>
                        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                          <h2 style={{ padding: '10px '}}>Valor del Log </h2>
                          <p style={{ fontSize: '20px' }}>{selectedLog.valorLog}</p>
                        </div>
                        {selectedLog.cambiosAntes && (
                          <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                            <h2 style={{ padding: '10px '}}>Información antes </h2>
                            <p style={{ fontSize: '20px' }}>{selectedLog.cambiosAntes}</p>
                          </div>
                        )}
                        {selectedLog.cambiosDespues && (
                          <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                            <h2 style={{ padding: '10px '}}>Información después </h2>
                            <p style={{ fontSize: '20px' }}>{selectedLog.cambiosDespues}</p>
                          </div>  
                        )}
                      </div>
                    )}
                    <div className={Log.infochildslog}>
                      <input type="submit" value="Cerrar" onClick={closeModal}></input>
                    </div>
                  </Modal>
                </div>
              ) : (
                <p>No hay datos coincidentes</p>
              )}

              {/*<h2>ID: {selectedLog.idLog}</h2>
                        <p>Tipo de Documento: {selectedLog.tipoDocumentoPersona}</p>
                        <p>Documento: {selectedLog.documentoPersona}</p>
                        <p>Fecha: {selectedLog.dateLog}</p>
                        <p>Acción: {selectedLog.accionLog}</p>
                        <p>Valor: {selectedLog.valorLog}</p>
                        <p>Cambios antes: {selectedLog.cambiosAntes}</p>
              <p>Cambios después: {selectedLog.cambiosDespues}</p>*/}

            </section>

          </div>
          <div className={Log.infochildslog}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <input type="button" value="Volver al inicio" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}