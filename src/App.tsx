import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './componentes/organismos/Navbar'
import Inicio from './paginas/Inicio'
import Contacto from './paginas/Contacto'
import Carrito from './paginas/Carrito'
import Quien from './paginas/Quien'
import Footer from './componentes/organismos/Footer'


import "bootstrap/dist/css/bootstrap.min.css"
import './index.css'
import Login from './paginas/Login'

function App() {

  const { pathname } = useLocation()
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/quienessomos" element={<Quien />} />
        <Route path="/login" element = {<Login/>}/>
      </Routes>
      {pathname !== '/login' && <Footer />}
      
    </>
  )
}

export default App