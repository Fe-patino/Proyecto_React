import { Link } from 'react-router-dom'

interface BannerBienvenidaProps {
  nombre: string
}

// Franja de bienvenida que solo ve quien inició sesión
function BannerBienvenida({ nombre }: BannerBienvenidaProps) {
  return (
    <div className="bg-warning-subtle border-bottom py-3">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h5 className="mb-0">¡Bienvenido, {nombre}!</h5>
          <small className="text-muted">Qué bueno verte de nuevo en Gas El Volcán.</small>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-warning btn-sm fw-semibold" to="/productos">
            Ver productos
          </Link>
          <Link className="btn btn-outline-dark btn-sm" to="/carrito">
            Mi carrito
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BannerBienvenida