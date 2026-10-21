import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="container-fluid">
        {/* Marca / Logo */}
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          Mi Tienda <span style={{ color: '#f97316' }}>Gas el Volcán</span>
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
          <div className="navbar-nav ms-auto gap-2">
            <Link className="nav-link text-white fw-semibold" to="/">
              Inicio
            </Link>
            <Link className="nav-link text-white fw-semibold" to="/productos">
              Productos
            </Link>
            <Link className="nav-link text-white fw-semibold" to="/contacto">
              Contacto
            </Link>
            <Link className="nav-link text-white fw-semibold" to="/quienessomos">
              Quienes Somos
            </Link> 
            <Link className="nav-link" to="/carrito">
             <img src="/img/carrito.png" alt="Carrito" width="28" height="28" />
            </Link>
            <Link className='nav-lin' to="/login">
              <img src="/img/Login.png"alt="Login" width="28"height="28"/>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;