import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import del from '../styles/style.module.css';
import { Link } from 'react-router-dom';

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
    return <div className={del.containerform}>
    <div className={del.information}>
      <div className={del.infochilds}>
        <h2>Bienvenido</h2>
        <p>¿Quieres hacer algo más con tu información?</p>
        <Link to="/create" style={{ textDecoration: 'none' }}>
          <input type="button" value="Añadir" />
        </Link>
        <Link to="/search" style={{ textDecoration: 'none' }}>
          <input type="button" value="Modificar" />
        </Link>
      </div>
    </div>
    <div className={del.forminformation}>
      <div className={del.forminformationchilds}>
        <h2>Borrar datos</h2>
        <div className={del.icons}>
          <a href="/select">
            <box-icon type='solid' name='a'></box-icon>
          </a>
          <a href="/select">
            <i className='bx bx-search'></i>
          </a>
        </div>
        <p>o consultar tu información</p>
        <form className={del.form}>
          <label>
            <i className='bx bxs-id-card'></i>
            <input
              type="text"
              name="nroDocumento"
              id="nroDocumento" placeholder="Número De Documento"
              onChange={(e) => setnumDocumento(e.target.value)}
            />
          </label>
          <input type="submit" value="Borrar"onClick={submit} />
        </form>
      </div>
    </div>
  </div>
}