import { Link } from 'react-router-dom';
import { useCarrito } from '../../useCarrito';

interface NavbarProps {
  esAdmin?: boolean;
  alCerrarSesion?: () => void;
}

function Navbar({ esAdmin = false, alCerrarSesion }: NavbarProps) {
  const { totalUnidades } = useCarrito();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="container-fluid">
        {/* Marca / Logo */}
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          <span style={{ color: '#f97316' }}>Gas el Volcán</span>
        </Link>

        {/* Botón responsive para pantallas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de Navegación con enlaces claros */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto gap-2 align-items-lg-center">
            <Link className="nav-link text-white fw-semibold" to="/">
              Inicio
            </Link>
            <Link className="nav-link text-white fw-semibold" to="/productos">
              Productos
            </Link>
            <Link className="nav-link text-white fw-semibold" to="/contacto">
              Contacto
            </Link>
            <Link className="nav-link text-white fw-semibold" to="/novedades">
              Novedades
            </Link>
            <Link className="nav-link text-white fw-semibold" to="/quienessomos">
              Quienes Somos
            </Link>
            <Link className="nav-link position-relative" to="/carrito">
              <img src="/img/carrito.png" alt="Carrito" width="28" height="28" />
              {totalUnidades > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger"
                  data-testid="contador-carrito"
                >
                  {totalUnidades}
                </span>
              )}
            </Link>

            {/* Con sesión de administrador: volver al panel o cerrar sesión; si no, el icono de login */}
            {esAdmin ? (
              <>
                <Link className="btn btn-warning btn-sm fw-semibold" to="/admin">
                  Panel admin
                </Link>
                <button className="btn btn-outline-light btn-sm" onClick={alCerrarSesion}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="nav-link" to="/login">
                <img src="/img/Login.png" alt="Login" width="28" height="28" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;