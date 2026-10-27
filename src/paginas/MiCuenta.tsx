import { Link } from 'react-router-dom'
import type { Sesion } from '../sesion'

interface MiCuentaProps {
  sesion: Sesion
}

// Vista de perfil: datos de la sesión actual
function MiCuenta({ sesion }: MiCuentaProps) {
  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">Mi cuenta</h1>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Nombre</p>
              <p className="fw-semibold">{sesion.nombre}</p>
              <p className="text-muted mb-1">Correo</p>
              <p className="fw-semibold">{sesion.correo}</p>
              <p className="text-muted mb-1">Tipo de cuenta</p>
              <p className="fw-semibold text-capitalize">{sesion.tipo}</p>
              <Link className="btn btn-warning fw-semibold" to="/productos">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiCuenta