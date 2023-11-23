import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export const SearchPerson = () => {

    // Acá solo se usa el num de documento
    // Esta página solo muestra un input para el documento, que se envía después a la página de update
    const [numDocumento, setnumDocumento] = useState('');
    const navigate = useNavigate();

    const submit = async e => {

        e.preventDefault();
        // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
        // Redirecciona hacia la página update de la siguiente forma. Agrega el num de documento del formulario a la URL de la página
        navigate(`/update?datos=${numDocumento}`);
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
                    onChange={e => setnumDocumento(e.target.value)}
                />
                </div>

                <button type="submit"onClick={submit}>Submit</button>

                </form>
            </div>
}