import {Prin} from "./components/pag_principal";
import {CreatePerson} from "./components/CreatePerson";
import {DeletePerson} from "./components/DeletePerson";

import {SearchPerson} from "./components/SearchPersona";
import {UpdatePerson} from "./components/UpdatePerson";

import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

// Esto de BrowserRouter lo único que hace es definir las rutas de la página
// Es decir dónde puede dirigirse

// De  momento solo hay las páginas para:
// página principal, create, update y delete

// Update está en dos pasos, search que pide la identificación únicamente
// Y update que muestra y actualiza todos los datos
export default function MyApp() {
  return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Prin/>}/>
            <Route path="/create" element={<CreatePerson/>}/>

           
            <Route path="/search" element={<SearchPerson/>}/>
            <Route path="/update" element={<UpdatePerson/>}/>
            
            <Route path="/delete" element={<DeletePerson/>}/>
            
        </Routes>
    </BrowserRouter>;

}
