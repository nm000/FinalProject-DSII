import React, { useState } from 'react';

export const SelectPerson = () => {

    // Acá solo se usa el num de documento
    // Esta página solo muestra un input para el documento, que se envía después a la página de update
    const [numDoc, setnumDoc] = useState('');

    // Inicializar variable que contendrá todos los datos de la persona
    const [personaData, setPersonaData] = useState({});

    const submit = async e => {

        e.preventDefault();
        // Luego, puedes navegar a la nueva página y pasar los datos a través de la barra de direcciones de URL
        try {

            // SOLICITUD GET PARA LEER UNA PERSONA Y SUS DATOS
            const persona = await fetch(`http://localhost:8000/persona/${numDoc}`);

            if (persona.ok) {
                const personaData = await persona.json();

                setPersonaData(personaData);

                // Decodifica el string base64 a un array de bytes
                const fotoBytes = atob(personaData.foto);

                // Convierte los bytes a un array Uint8
                const fotoUint8Array = new Uint8Array(fotoBytes.length);
                for (let i = 0; i < fotoBytes.length; i++) {
                    fotoUint8Array[i] = fotoBytes.charCodeAt(i);
                }

                // Obtén la imagen como un objeto Blob
                const imagenBlob = new Blob([fotoUint8Array], { type: 'image/jpeg' });

                // Crea una URL de objeto para la imagen
                const imagenUrl = URL.createObjectURL(imagenBlob);

                // Asigna la URL de objeto a la propiedad src de una etiqueta img
                const imagenElement = document.getElementById('imagenPersona');
                imagenElement.src = imagenUrl;

            } else {
                console.error('Error en la solicitud HTTP');
            }
        } catch (error) {
            console.error('Ocurrió un error:', error);
        }

    }

    // Solo un HTML para el input del num de documento
    return <div className='container'>
        <div className={logstyle.img} />
        <div className={styleShow.containerform}>
            <div className={styleShow.information}>
                <div className={styleShow.infochilds}>
                    <h2>-------------</h2>
                    <h3>Acerca de mi: </h3>
                    <p>Genero: <span>------------</span></p>
                    <p>Fecha de Nacimiento: <span></span>---</p>
                    <h3>Informacion de contacto:</h3>
                    <p>Número de Celular: <span>------</span></p>
                    <p>Correo Electrónico: <span>------</span></p>
                </div>
            </div>
            <div className={styleShow.forminformation}>
                <div className={styleShow.forminformationchilds}>
                    <img src={user} />
                    <p>Seleccione el tipo de documento:</p>
                    <form className={styleShow.form}>
                        <label >
                            <i className='bx bxs-user-account'></i>
                            <select
                                id="tipoDocumento" name="tipoDocumento" onChange={(e) => setTipoDocumento(e.target.value)}
                            >
                                <option value="Seleccione el tipo de documento">Seleccione el tipo de documento</option>"
                                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                                <option value="Cedula">Cédula</option>
                            </select>
                        </label>
                    </form>
                    <p>Digite el numero de documento:</p>
                    <label>
                        <i className='bx bxs-id-card'></i>
                        <input
                            type="number"
                            id="numDocumento"
                            name="numDocumento" placeholder="Documento"
                            onChange={(e) => setnumDocumento(parseInt(e.target.value))}
                        />
                    </label>
                    <form className={styleShow.form}>
                        <Link to="/select" style={{ textDecoration: 'none' }}>
                            <input type="button" defaultValue="Mostrar" />
                        </Link>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <input type="button" defaultValue="Volver al inicio" />
                        </Link>
                    </form>
                </div>
            </div>
        </div>
        <div className={styleShow.hide}>
            <div className={styleShow.information}>
                <div className={styleShow.infochilds}>
                    <h2>
                        <input
                            type="text"
                            id="primerNombre"
                            name="primerNombre"
                            defaultValue={personaData.primerNombre}
                            disabled
                        />
                        <input
                            type="text"
                            id="segundoNombre"
                            name="segundoNombre"
                            defaultValue={personaData.segundoNombre}
                            disabled
                        />
                        <input
                            type="text"
                            id="apellidos"
                            name="apellidos"
                            defaultValue={personaData.apellidos}
                            disabled
                        />
                    </h2>
                    <h3>Acerca de mi:</h3>
                    <p>Genero:
                        <input
                            type="text"  /* Utiliza un input de tipo 'file' para cargar una imagen binaria */
                            id="genero"
                            name="genero"
                            defaultValue={personaData.genero}
                            disabled
                        // No es necesario utilizar 'value' y 'onChange' para campos de archivo
                        // En su lugar, puedes manejar la carga de la imagen en una función separada
                        />
                    </p>
                    <p>Fecha de Nacimiento:
                        <input
                            type="date"
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            pattern="\d{2}-\d{2}-\d{4}"
                            placeholder="dd-mm-aaaa"
                            defaultValue={personaData.fechaNacimiento}
                            disabled
                        />
                    </p>
                    <h3>Informacion de contacto:</h3>
                    <p>Número de Celular:
                        <input
                            type="text"
                            id="celular"
                            name="celular"
                            defaultValue={personaData.celular}
                            disabled
                        />
                    </p>
                    <p>Correo Electrónico:
                        <input
                            type="email"
                            id="correoElectronico"
                            name="correoElectronico"
                            defaultValue={personaData.correoElectronico}
                            disabled
                        />
                    </p>
                </div>
            </div>
            <div className={styleShow.forminformation}>
                <div className={styleShow.forminformationchilds}>
                    <input
                        type="file"
                        id="foto"
                        name="foto"
                        DefaultValue={personaData.selectedFile}
                        disabled
                    />
                    <h3>Inforamcion de usuario: </h3>
                    <p>Tipo de documento:
                        <input
                            type="tipoDocumento"
                            id="tipoDocumento"
                            name="tipoDocumento"
                            defaultValue={personaData.tipoDocumento}
                            disabled
                        />
                    </p>
                    <p>Numero de documento:
                        <input
                            type="text"
                            id="nroDocumento"
                            name="nroDocumento"
                            defaultValue={personaData.numDocumento}
                            disabled
                        />
                    </p>
                    <form className={styleShow.form}>
                        <Link to="/select" style={{ textDecoration: 'none' }}>
                            <input type="button" defaultValue="Mostrar" />
                        </Link>
                        <Link to="/select" style={{ textDecoration: 'none' }}>
                            <input type="button" defaultValue="Volver al inicio" />
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    </div>
}
