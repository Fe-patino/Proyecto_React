import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './componentes/organismos/Navbar'
import Footer from './componentes/organismos/Footer'
import Inicio from './paginas/Inicio'
import Contacto from './paginas/Contacto'
import Productos from './paginas/Productos'
import DetalleProducto from './paginas/DetalleProducto'
import Carrito from './paginas/Carrito'
import Quien from './paginas/Quien'
import Login from './paginas/Login'
import Administrador from './paginas/Administrador'
import Novedades from './paginas/Novedades'

function App() {
  // Ruta actual, por ejemplo "/login"
  const { pathname } = useLocation()

  // Quién inició sesión: "" (nadie), "cliente" o "administrador"
  const [sesion, setSesion] = useState('')
  const esAdmin = sesion === 'administrador'

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        {/* Ruta con parámetro: el detalle según el id del producto */}
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/novedades" element={<Novedades/>}/>
        <Route path="/quienessomos" element={<Quien />} />
        <Route path="/login" element={<Login alIngresar={setSesion} />} />

        {/* Solo entra el administrador; los demás vuelven al login */}
        <Route
          path="/admin"
          element={esAdmin ? <Administrador alCerrarSesion={() => setSesion('')} /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* El footer se muestra en todas las páginas menos en /login */}
      {pathname !== '/login' && <Footer />}
    </>
  )
}

export default App