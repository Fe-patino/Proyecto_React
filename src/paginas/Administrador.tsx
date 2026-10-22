import { useNavigate } from 'react-router-dom'

interface AdministradorProps {
  alCerrarSesion: () => void
}

function Administrador({ alCerrarSesion }: AdministradorProps) {
  const navegar = useNavigate()

  const cerrarSesion = () => {
    alCerrarSesion()
    navegar('/login')
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Panel de administración</h1>
        <button className="btn btn-outline-danger" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
      <p>Bienvenido, administrador. Desde aquí podrás gestionar los productos y los usuarios de la tienda.</p>

    </div>
  )
}

export default Administrador