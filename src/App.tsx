import {Routes, Route} from 'react-router-dom'
import Navbar from './componentes/organismos/Navbar'

import Inicio from './paginas/Inicio'



import "bootstrap/dist/css/bootstrap.min.css"

function App(){
  return(
    <>
        <Navbar/>
            <Routes>
                <Route
                path="/"
                element={<Inicio/>}/>
            </Routes>
    </>
  )
}
export default App
