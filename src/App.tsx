import { useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
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

const CLAVE_SESION = 'gasElVolcan_sesion'

// Lee la sesión guardada; si no hay nada, nadie ha iniciado sesión
function leerSesion(): string {
  try {
    return sessionStorage.getItem(CLAVE_SESION) ?? ''
  } catch {
    return ''
  }
}

function App() {
  // Ruta actual, por ejemplo "/login"
  const { pathname } = useLocation()
  const navegar = useNavigate()

  // Quién inició sesión: "" (nadie), "cliente" o "administrador"
  const [sesion, setSesion] = useState<string>(leerSesion)
  const esAdmin = sesion === 'administrador'

  const guardarSesion = (tipo: string) => {
    setSesion(tipo)
    try {
      if (tipo) sessionStorage.setItem(CLAVE_SESION, tipo)
      else sessionStorage.removeItem(CLAVE_SESION)
    } catch {
      // si el navegador bloquea el almacenamiento, la sesión dura mientras no se recargue
    }
  }

  // Cerrar sesión con advertencia previa
  const cerrarSesion = () => {
    if (window.confirm('¿Seguro que desea cerrar la sesión de administrador?')) {
      guardarSesion('')
      navegar('/login')
    }
  }

  return (
    <>
      <Navbar esAdmin={esAdmin} alCerrarSesion={cerrarSesion} />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        {/* Ruta con parámetro: el detalle según el id del producto */}
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/quienessomos" element={<Quien />} />
        <Route path="/login" element={<Login alIngresar={guardarSesion} />} />

        {/* Solo entra el administrador; los demás vuelven al login */}
        <Route
          path="/admin"
          element={esAdmin ? <Administrador alCerrarSesion={() => guardarSesion('')} /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* El footer se muestra en todas las páginas menos en /login */}
      {pathname !== '/login' && <Footer />}
    </>
  )
}

export default App