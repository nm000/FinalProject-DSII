import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Log from '../styles/LogStyle.module.css';
export const LogConsole = () => {

  // Acá solo se usa el num de documento
  // Esta página solo muestra un input para el documento, que se envía después a la página de update
  const [numDoc, setnumDoc] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');
  const [fecha, setfecha] = useState('');

  // Inicializar variable que contendrá todos los datos de la persona
  const [personaData, setPersonaData] = useState({});

  const submit = async e => {

    e.preventDefault();
    // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
    try {

      // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
      const persona = await fetch(`http://localhost:8004/log?tipoDoc=${tipoDoc}&numDoc=${numDoc}&fecha=${fecha}`);

      if (persona.ok) {
        const personaData = await persona.json();
        console.log(personaData)
        // colocar en personaData todos los datos de la persona
        setPersonaData(personaData);

      } else {
        console.error('Error en la solicitud HTTP');
      }
    } catch (error) {
      console.error('Ocurrió un error:', error);
    }

  }

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
                  <option value="Seleccione el tipo de documento">Seleccione el tipo de documento</option>"
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                  <option value="Cedula">Cédula</option>
                </select>
              </label>

              <input type="submit" value="Buscar" />

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
                    const formattedDate = inputDate
                      .split('-')
                      .reverse()
                      .join('-');
                    setfecha(formattedDate);
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
                      <th>Tipo ID</th>
                      <th>Documento</th>
                      <th>Fecha</th>
                      <th>Acción</th>

                    </tr>
                  </thead>
                </table>
              </div>
              <div className={Log.tblcontent}>
                <table cellpadding="0" cellspacing="0" border="0">
                  <tbody>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>17/11/23</td>
                      <td>modificar</td>

                    </tr>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>17/11/23</td>
                      <td>modificar</td>

                    </tr>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>10/11/23</td>
                      <td>crear</td>

                    </tr>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>17/11/23</td>
                      <td>modificar</td>

                    </tr>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>17/11/23</td>
                      <td>borrar</td>

                    </tr>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>17/11/23</td>
                      <td>borrar</td>

                    </tr>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>17/11/23</td>
                      <td>modificar</td>

                    </tr>
                    <tr>
                      <td>Cédula</td>
                      <td>1003239160 </td>
                      <td>12/11/23</td>
                      <td>crear</td>

                    </tr>

                  </tbody>
                </table>
              </div>

            </section>

          </div>
          <div className={Log.infochildslog}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <input type="button" value="Volver al inicio"  />
            </Link>
          </div>
        </div>



      </div>
    </div>
  );
}