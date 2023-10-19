import {Base} from "./components/base";
import {CreatePerson} from "./components/CreatePerson";

import './App.css';



import {BrowserRouter, Routes, Route} from 'react-router-dom';

export default function MyApp() {
  return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Base/>}/>
            <Route path="/create" element={<CreatePerson/>}/>

        </Routes>
    </BrowserRouter>;

}
