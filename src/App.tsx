import { useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './componentes/organismos/Navbar'
import Footer from './componentes/organismos/Footer'
import BannerBienvenida from './componentes/organismos/BannerBienvenida'
import Inicio from './paginas/Inicio'
import Contacto from './paginas/Contacto'
import Productos from './paginas/Productos'
import DetalleProducto from './paginas/DetalleProducto'
import Carrito from './paginas/Carrito'
import Quien from './paginas/Quien'
import Login from './paginas/Login'
import Administrador from './paginas/Administrador'
import Novedades from './paginas/Novedades'
import MiCuenta from './paginas/MiCuenta'
import { crearSesion, guardarSesionLocal, leerSesion } from './sesion'
import type { Sesion } from './sesion'

function App() {
  // Ruta actual, por ejemplo "/login"
  const { pathname } = useLocation()
  const navegar = useNavigate()

  // Quién inició sesión (null si nadie); se recupera al recargar la página
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion)
  const esAdmin = sesion?.tipo === 'administrador'

  const iniciarSesion = (tipo: string, correo: string) => {
    const nueva = crearSesion(tipo, correo)
    setSesion(nueva)
    guardarSesionLocal(nueva)
  }

  const quitarSesion = () => {
    setSesion(null)
    guardarSesionLocal(null)
  }

  // Cerrar sesión con advertencia previa
  const cerrarSesion = () => {
    const quien = esAdmin ? 'de administrador' : 'de usuario'
    if (window.confirm('¿Seguro que desea cerrar la sesión ' + quien + '?')) {
      quitarSesion()
      navegar('/login')
    }
  }

  return (
    <>
      <Navbar sesion={sesion} alCerrarSesion={cerrarSesion} />

      {/* Bienvenida solo en el inicio y solo con sesión iniciada */}
      {sesion && pathname === '/' && <BannerBienvenida nombre={sesion.nombre} />}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        {/* Ruta con parámetro: el detalle según el id del producto */}
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/quienessomos" element={<Quien />} />
        <Route
          path="/login"
          element={!sesion ? <Login alIngresar={iniciarSesion} /> : <Navigate to={esAdmin ? '/admin' : '/'} />}
        />

        {/* Perfil: solo con sesión iniciada */}
        <Route path="/cuenta" element={sesion ? <MiCuenta sesion={sesion} /> : <Navigate to="/login" />} />

        {/* Solo entra el administrador; los demás vuelven al login */}
        <Route
          path="/admin"
          element={esAdmin ? <Administrador alCerrarSesion={quitarSesion} /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* El footer se muestra en todas las páginas menos en /login */}
      {pathname !== '/login' && <Footer />}
    </>
  )
}

export default App