import { Routes, Route } from 'react-router-dom'
import Navbar from './componentes/organismos/Navbar'
import Inicio from './paginas/Inicio'
import Contacto from './paginas/Contacto'
import Productos from './paginas/Productos'
import DetalleProducto from './paginas/DetalleProducto'

// 1. Estilos base de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"

// 2. Estilos personalizados (sobreescriben Bootstrap)
import './index.css'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/contacto" element={<Contacto/>} />
      </Routes>
    </>
  )
}

export default App
