import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../styles/style.module.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const SearchPersonSelect = () => {

  // Acá solo se usa el num de documento
  // Esta página solo muestra un input para el documento, que se envía después a la página de update
  const [numDocumento_input, setnumDocumento_input] = useState('');
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

  function contieneSoloNumeros(cadena) {
    // Utilizar una expresión regular para verificar si la cadena contiene solo números
    return /^[0-9]+$/.test(cadena);
  }

  const submit = async e => {

    e.preventDefault();
    // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
    // Redirecciona hacia la página update de la siguiente forma. Agrega el num de documento del formulario a la URL de la página
    if (numDocumento_input !== '' && contieneSoloNumeros(numDocumento_input)) {
      const numDocumento = parseInt(numDocumento_input)
      if (typeof numDocumento === "number" && numDocumento.toString().length <= 10 && !isNaN(numDocumento)) {
        try {
          const response = await fetch(`http://localhost:8000/persona/${numDocumento}?validez=true`);

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
          text: "Su documento debe tener 10 dígitos o menos, sin letras"
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No digite letras en su documento ni lo deje vacío"
      });
    }
  }

  // Solo un HTML para el input del num de documento
  return <div className={Search.containerform}>
    <div className={Search.information}>
      <div className={Search.infochilds}>
        <h2>Bienvenido</h2>
        <p>¿Quieres hacer algo más con tu información?</p>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'create', ports: ['8002'] }])} >
          <input type="button" value="Añadir" />
        </Link>
        <Link style={{ textDecoration: 'none' }} onClick={() => validateMicroservice([{ endpoint: 'delete', ports: ['8001'] }])} >
          <input type="button" value="Borrar" />
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/" >
          <input type="button" value="Inicio" />
        </Link>
      </div>
    </div>
    <div className={Search.forminformation}>
      <div className={Search.forminformationchilds}>
        <h2 style={{ marginBottom: '30px' }}>Ingrese Documento para consultar</h2>
        <div className={Search.icons}>
          <a onClick={() => validateMicroservice([{ endpoint: 'search', ports: ['8003'] }])} >
            <box-icon type='solid' name='a'></box-icon>
          </a>
          <a onClick={() => validateMicroservice([{ endpoint: 'search', ports: ['8003'] }])} >
            <i class='bx bx-edit'></i>
          </a>
        </div>
        <p>o modificar tu información</p>
        <form className={Search.form}>
          <label>
            <i class='bx bxs-id-card'></i>
            <input
              type="text"
              id="nroDocumento"
              name="nroDocumento" placeholder="Documento"
              onChange={(e) => setnumDocumento_input(e.target.value)}
            />
          </label>
          <Link to="/persona" style={{ textDecoration: 'none' }}>
            <input type="submit" value="Buscar" id="Buscar" onClick={submit} />
          </Link>
        </form>
      </div>
    </div>
  </div>
}