import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Log from '../styles/LogStyle.module.css';

export const LogConsole = () => {

  // Acá solo se usa el num de documento
  // Esta página solo muestra un input para el documento, que se envía después a la página de update
  const [numDoc, setnumDoc] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');
  const [fecha, setfecha] = useState('');

  // Inicializar variable que contendrá todos los datos de la persona
  const [logs, setLogs] = useState({});

  const submit = async e => {

    e.preventDefault();
    // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
    try {

      // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
      const response = await fetch(`http://localhost:8004/log?tipoDoc=${tipoDoc}&numDoc=${numDoc}&fecha=${fecha}`);

      if (response.ok) {
        const logData = await response.json();

        // colocar en personaData todos los datos de la persona
        setLogs(logData);

        console.log(logs)

      } else {
        console.error('Error en la solicitud HTTP');
      }
    } catch (error) {
      console.error('Ocurrió un error:', error);
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
      <div className={Log.containerformlog}>
        <div className={Log.informationlog}>
          <div className={Log.infochildslog}>
            <h2>CONSULTA DE REGISTRO</h2>
          </div>
        </div>
        <div className={Log.forminformationlog}>
          <div className={Log.forminformationchildslog}>
            <form className={Log.formlog}>
              <h2>Tipo De Documento</h2>
              <label >
                <i className='bx bxs-user-account'></i>
                <select
                  id="tipoDocumento" name="tipoDocumento" onChange={(e) => setTipoDoc(e.target.value)}
                >
                  <option value="">Seleccione el tipo de documento</option>"
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                  <option value="Cedula">Cédula</option>
                </select>
              </label>
              <input type="submit" onClick={submit} value="Buscar" />
            </form>
            <form className={Log.formlog}>
              <h2>Documento</h2>
              <label>
                <i className='bx bxs-id-card'></i>
                <input
                  type="number"
                  id="numDocumento"
                  name="numDocumento" placeholder="Documento"
                  onChange={(e) => setnumDoc(parseInt(e.target.value))}
                />
              </label>
            </form>
            <form className={Log.formlog}>
              <h2>Fecha Registro</h2>
              <label >
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento" placeholder="Fecha Nacimiento"
                  onChange={(e) => {
                    const inputDate = e.target.value;
                    setfecha(inputDate);
                  }}
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
                          <td>{log.idLog}</td>
                          <td>{log.tipoDocumentoPersona}</td>
                          <td>{log.documentoPersona}</td>
                          <td>{log.dateLog}</td>
                          <td>{log.accionLog}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Cargando datos...</p>
              )}

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