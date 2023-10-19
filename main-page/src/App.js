import {Prin} from "./components/pag_principal";
import {CreatePerson} from "./components/CreatePerson";
import {DeletePerson} from "./components/DeletePerson";

import {SearchPerson} from "./components/SearchPersona";
import {UpdatePerson} from "./components/UpdatePerson";

import './App.css';



import {BrowserRouter, Routes, Route} from 'react-router-dom';

export default function MyApp() {
  return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Prin/>}/>
            <Route path="/create" element={<CreatePerson/>}/>

            // Proceso de Update
            <Route path="/search" element={<SearchPerson/>}/>
            <Route path="/update" element={<UpdatePerson/>}/>
            
            <Route path="/delete" element={<DeletePerson/>}/>
            
        </Routes>
    </BrowserRouter>;

}
