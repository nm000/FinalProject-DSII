import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import del from '../styles/style.module.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const DeletePerson = () => {

  const [numDocumento, setnumDocumento] = useState(0);
  const navigate = useNavigate();
  async function validateMicroservice(microservices) {
    try {
      for (const { endpoint, ports } of microservices) {
        for (const port of ports) {
          const response = await fetch(`http://localhost:${port}/disp`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
          }

          const repuesta = await response.json();

          if (!repuesta.disponibilidad) {
            Swal.fire({
              icon: "error",
              title: "Lo sentimos...",
              text: `Este servicio no está disponible actualmente. Inténtalo más tarde`,
            });
            return;  // Salir de la función si un microservicio no está disponible
          }
        }
      }

      // Si todos los microservicios están disponibles, redirige a la página correspondiente
      navigate(`/${microservices[0].endpoint}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lo sentimos...",
        text: `Este servicio no está disponible actualmente. Inténtalo más tarde`,
      });
    }
  }

  const submit = async e => {

    // Esto va siempre
    e.preventDefault();

    // Se envía la solicitud DELETE al microservicio, enviando el num. de identificación mediante la URL
    if (typeof numDocumento === "number" && numDocumento.toString().length <= 10 && !isNaN(numDocumento) && numDocumento >= 0) {
      try {
        const response = await fetch(`http://localhost:8001/persona/${numDocumento}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (!response.ok) {
          // Si el código de estado no es OK, lanzar una excepción
          throw new Error(`Error al eliminar el registro. Código de estado: ${response.status}`);
        }
      
        // Si la respuesta es OK, el registro se eliminó correctamente
        console.log('Registro eliminado correctamente');
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

    // Esto lo único que hace es que retrocede uno a la página
    // Por ejemplo cuando el create se hace correctamente, te devuelve a la página del menú de opciones
  }

  // El HTML solo tiene el input para la ID 
  return <div className={del.containerform}>
    <div className={del.information}>
      <div className={del.infochilds}>
        <h2>Bienvenido</h2>
        <p>¿Quieres hacer algo más con tu información?</p>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'create', ports: ['8002'] }])} >
          <input type="button" value="Añadir" />
        </Link>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'search', ports: ['8003'] }])} >
          <input type="button" value="Modificar" />
        </Link>
      </div>
    </div>
    <div className={del.forminformation}>
      <div className={del.forminformationchilds}>
        <h2>Borrar datos</h2>
        <div className={del.icons}>
          <a onClick={() => validateMicroservice([{ endpoint: 'searchperson', ports: ['8000'] }])} >
            <box-icon type='solid' name='a'></box-icon>
          </a>
          <a onClick={() => validateMicroservice([{ endpoint: 'searchperson', ports: ['8000'] }])} >
            <i className='bx bx-search'></i>
          </a>
        </div>
        <p>o consultar tu información</p>
        <form className={del.form}>
          <label>
            <i className='bx bxs-id-card'></i>
            <input
              type="number"
              name="nroDocumento"
              id="nroDocumento" placeholder="Número De Documento"
              onChange={(e) => setnumDocumento(parseInt(e.target.value))}
              min="0"
            />
          </label>
          <input type="submit" value="Borrar" onClick={submit} />
        </form>
      </div>
    </div>
  </div>
}