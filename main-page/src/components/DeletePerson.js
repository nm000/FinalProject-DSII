import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export const DeletePerson = () => {

    const [numDocumento, setnumDocumento] = useState('');

    const submit = async e => {

        // Esto va siempre
        e.preventDefault();
        
        // Se envía la solicitud DELETE al microservicio, enviando el num. de identificación mediante la URL
        await fetch(`http://localhost:8001/${numDocumento}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
          
          // Esto lo único que hace es que retrocede uno a la página
          // Por ejemplo cuando el create se hace correctamente, te devuelve a la página del menú de opciones
        }          
    
    // El HTML solo tiene el input para la ID 
    return <div className='container'>
                <form>
                
                <div>
                <label htmlFor="nroDocumento">Nro. Documento:</label>
                <input
                    type="text"
                    id="nroDocumento"
                    name="nroDocumento"
                    onChange={e => setnumDocumento(e.target.value)}
                />
                </div>

                <button type="submit"onClick={submit}>Submit</button>

                </form>
            </div>
}