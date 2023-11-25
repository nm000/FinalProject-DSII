import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogStyle.css';

export const LogConsole = () => {

  // Acá solo se usa el num de documento
  // Esta página solo muestra un input para el documento, que se envía después a la página de update
  const [numDoc, setnumDoc] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');
  const [fecha, setfecha] = useState('');

  const navigate = useNavigate();

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
  return (<div>
    <div class="img"></div>
    <div class="container-form delete">
      <div class="information">
        <div class="info-childs">
          <h2>CONSULTA DE REGISTRO</h2>

        </div>
      </div>
      <div class="form-information">
        <div class="form-information-childs">


          <form class="form">


            <h2>Tipo De Documento</h2>

            <label>
              <i class='bx bxs-user-account'></i>
              <select id="tipoDoc">
                <option value="Seleccione el tipo de documento">Seleccione el tipo de documento</option>
                <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                <option value="Cedula">Cedula</option>
              </select>
            </label>

            <input type="submit" value="Buscar" />
          </form>
          <form class="form">


            <h2>Documento</h2>

            <label>

              <i class='bx bxs-id-card'></i>
              <input type="text" placeholder="Documento" />


            </label>


          </form>
          <form class="form">


            <h2>Fecha Registro</h2>

            <label>
              <i class='bx bx-calendar'></i>
              <input type="date" placeholder="Fecha Nacimiento" />
            </label>


          </form>




        </div>
        <div class="form-information-children">
          <section>


            <div class="tbl-header">
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
            <div class="tbl-content">
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
        <div class="info-childs">
          <input type="button" value="Volver al inicio" id="delete-añadir" />
        </div>
      </div>


      <script src="script.js"></script>
    </div>


  </div>);
  <div className='container'>
    <form>
      <div>
        <label htmlFor="nroDocumento">Nro. Documento:</label>
        <input
          type="text"
          id="nroDocumento"
          name="nroDocumento"
          // onChange actualiza la variable del dato cada vez que se cambia en el input
          onChange={e => setnumDoc(e.target.value)}
        />
      </div>

      <button type="submit" onClick={submit}>Submit</button>

    </form>
  </div>
}