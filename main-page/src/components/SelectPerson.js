import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export const SelectPerson = () => {

    // Acá solo se usa el num de documento
    // Esta página solo muestra un input para el documento, que se envía después a la página de update
    const [numDoc, setnumDoc] = useState('');
    const navigate = useNavigate();
    
    // Inicializar variable que contendrá todos los datos de la persona
    const [personaData, setPersonaData] = useState({});

    const submit = async e => {

        e.preventDefault();
        // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
        try {

            // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
            const persona = await fetch(`http://localhost:8000/${numDoc}`);
      
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
    return <div className='container'>
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

                <button type="submit"onClick={submit}>Submit</button>

                </form>

                <div>
                    <label htmlFor="tipoDocumento">Nro. Documento:</label>
                    <input
                    type="tipoDocumento"
                    id="tipoDocumento"
                    name="tipoDocumento"
                    defaultValue={personaData.tipoDocumento}
                    disabled
                    />
                </div>

                <div>
                    <label htmlFor="nroDocumento">Nro. Documento:</label>
                    <input
                    type="text"
                    id="nroDocumento"
                    name="nroDocumento"
                    defaultValue={personaData.numDocumento}
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
                    disabled  
                    />
                </div>
                <div>
                    <label htmlFor="segundoNombre">Segundo Nombre:</label>
                    <input
                    type="text"
                    id="segundoNombre"
                    name="segundoNombre"
                    defaultValue={personaData.segundoNombre}
                    disabled  
                    />
                </div>
                <div>
                    <label htmlFor="apellidos">Apellidos:</label>
                    <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    defaultValue={personaData.apellidos}
                    disabled  
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
                    disabled  
                    />
                </div>
                <div>
                    <label htmlFor="genero">Género:</label>
                    <input
                    type="text"  /* Utiliza un input de tipo 'file' para cargar una imagen binaria */
                    id="genero"
                    name="genero"
                    defaultValue={personaData.genero}
                    disabled  
                    // No es necesario utilizar 'value' y 'onChange' para campos de archivo
                    // En su lugar, puedes manejar la carga de la imagen en una función separada
                    />
                </div>
                <div>
                    <label htmlFor="correoElectronico">Correo Electrónico:</label>
                    <input
                    type="email"
                    id="correoElectronico"
                    name="correoElectronico"
                    defaultValue={personaData.correoElectronico}
                    disabled  
                    />
                </div>
                <div>
                    <label htmlFor="celular">Celular:</label>
                    <input
                    type="text"
                    id="celular"
                    name="celular"
                    defaultValue={personaData.celular}
                    disabled  
                    />
                </div>
                <div>
                    <label htmlFor="foto">Foto (binario):</label>
                    <input
                    type="text"  /* Utiliza un input de tipo 'file' para cargar una imagen binaria */
                    id="foto"
                    name="foto"
                    defaultValue={personaData.foto}
                    disabled  
                    // No es necesario utilizar 'value' y 'onChange' para campos de archivo
                    // En su lugar, puedes manejar la carga de la imagen en una función separada
                    />
                </div>
            </div>
}