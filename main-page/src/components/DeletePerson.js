import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export const DeletePerson = () => {

    const [numDocumento, setnumDocumento] = useState('');
    const navigate = useNavigate();

    const submit = async e => {

        e.preventDefault();
        
        await fetch(`http://localhost:8001/${numDocumento}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
          
          await navigate(-1);
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