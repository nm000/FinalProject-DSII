import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../styles/style.module.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const SearchPersonSelect = () => {

  // Acá solo se usa el num de documento
  // Esta página solo muestra un input para el documento, que se envía después a la página de update
  const [numDocumento, setnumDocumento] = useState(0);
  const navigate = useNavigate();

  const submit = async e => {

    e.preventDefault();
    // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
    // Redirecciona hacia la página update de la siguiente forma. Agrega el num de documento del formulario a la URL de la página
    if (typeof numDocumento === "number" && numDocumento.toString().length <= 10 && !isNaN(numDocumento) && numDocumento >= 0) {
      try {
        const response = await fetch(`http://localhost:8000/persona/${numDocumento}`);
      
        if (!response.ok) {
          // Si el código de estado no es OK, lanzar una excepción
          throw new Error(`Error al eliminar el registro. Código de estado: ${response.status}`);
        }
      
        // Si la respuesta es OK, el registro se eliminó correctamente
        navigate(`/persona?datos=${numDocumento}`);
      } catch (error) {
        // Manejar errores, mostrar mensaje de alerta si es un error 404
        if (error.message.includes('404')) {
          Swal.fire({
            title: "¿Documento errado?",
            text: "No se encontró la persona",
            icon: "question"
          });
        } else {
          console.error('Error al eliminar el registro:', error.message);
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Digite un tipo de documento válido"
      });
    }
  }

  // Solo un HTML para el input del num de documento
  return <div className={Search.containerform}>
    <div className={Search.information}>
      <div className={Search.infochilds}>
        <h2>Bienvenido</h2>
        <p>¿Quieres hacer algo más con tu información?</p>
        <Link to="/create" style={{ textDecoration: 'none' }}>
          <input type="button" value="Añadir" />
        </Link>
        <Link to="/delete" style={{ textDecoration: 'none' }}>
          <input type="button" value="Borrar" />
        </Link>
      </div>
    </div>
    <div className={Search.forminformation}>
      <div className={Search.forminformationchilds}>
        <h2>Ingrese Documento para consultar</h2>
        <div className={Search.icons}>
          <a href="/select">
            <box-icon type='solid' name='a'></box-icon>
          </a>
          <a href="/select">
            <i class='bx bx-search'></i>
          </a>
        </div>
        <p>o consultar tu información</p>
        <form className={Search.form}>
          <label>
            <i class='bx bxs-id-card'></i>
            <input
              type="number"
              placeholder="Documento"
              onChange={(e) => setnumDocumento(parseInt(e.target.value))}
              min="0"
            />
          </label>
          <Link to="/update" style={{ textDecoration: 'none' }}>
            <input type="submit" value="Buscar" id="Buscar" onClick={submit} />
          </Link>
        </form>
      </div>
    </div>
  </div>
}