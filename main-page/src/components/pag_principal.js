import React from 'react';

import NavSty from '../styles/styleNav.module.css';

import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export const Prin = () => {
  // El HTML del menú
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

  return(
    <div>
        <nav>
            <div className={NavSty.menu}>
                <div className={NavSty.logo}>
                    <a href="/">MyInfoVault</a>
                </div>
                <ul>
                    <li><a onClick={() => validateMicroservice([{ endpoint: 'create', ports: ['8002'] }])} >Crear</a></li>
                    <li><a onClick={() => validateMicroservice([{ endpoint: 'search', ports: ['8003'] }])} >Modificar</a></li>
                    <li><a onClick={() => validateMicroservice([{ endpoint: 'delete', ports: ['8001'] }])} >Borrar</a></li>
                </ul>
            </div>
        </nav>
        <div className={NavSty.img}/>
        <div className={NavSty.center}>
            <div className={NavSty.sub_title}>Gestión de información sin esfuerzo</div>
            <div className={NavSty.btns}>
              <a onClick={() => validateMicroservice([{ endpoint: 'searchperson', ports: ['8000'] }])} >
                <button>Ver Información</button>
                </a>
                <a onClick={() => validateMicroservice([{ endpoint: 'log', ports: ['8004'] }])} >
                    <button>Registro</button>
                </a> 
            </div>
        </div>
    </div>
);
}
// eslint-disable-next-line no-lone-blocks
{/*import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export const Prin = () => {
    
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  // Para cambiar la opción elegida del menú de opciones
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };


  function handleConfirmAction() {
    // Realiza la acción correspondiente en función de la opción seleccionada
    if (selectedOption === "opcion1") {
      // Lógica para "Crear personas"
      navigate('/create');
      // Puedes enviar los datos al servidor, mostrar un mensaje, etc.
    } else if (selectedOption === "opcion2") {
      // Lógica para "Modificar datos personales"
      navigate('/search');
    } else if (selectedOption === "opcion3") {
      // Lógica para "Consultar datos personales"
      navigate('/select');
    } else if (selectedOption === "opcion4") {
      // Lógica para "Borrar personas"
      navigate('/delete');
    } else if (selectedOption === "opcion5") {
      // Lógica para "Consultar log"
      navigate('/log');
    }
  }

  // El HTML del menú
  return (
    <div className=''>
      <h1>Tus datos personales</h1>
      <h2>Al alcance tuyo</h2>
      
      <div className='container'>
        <div className='centered-content'>
          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Crear personas</option>
            <option value="opcion2">Modificar datos personales</option>
            <option value="opcion3">Consultar datos personales</option>
            <option value="opcion4">Borrar personas</option>
            <option value="opcion5">Consultar log</option>
          </select>
          <button type="submit" onClick={handleConfirmAction}>Enviar</button>
        </div>
      </div>
    </div>
  );
}*/}