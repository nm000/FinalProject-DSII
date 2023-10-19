import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export const SearchPerson = () => {

    const [numDocumento, setnumDocumento] = useState('');
    const navigate = useNavigate();

    const submit = async e => {

        e.preventDefault();


          // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
          navigate(`/update?datos=${numDocumento}`);

        }          
    
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