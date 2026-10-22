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

  // Datos de ejemplo (más adelante vendrán del módulo de datos)
  const resumen = [
    { titulo: 'Productos', valor: '14', detalle: 'en el catálogo' },
    { titulo: 'Usuarios', valor: '3', detalle: 'registrados' },
    { titulo: 'Pedidos', valor: '120', detalle: 'este mes' },
  ]

  const categorias = [
    { nombre: 'Cilindros', porcentaje: 65 },
    { nombre: 'Accesorios', porcentaje: 25 },
    { nombre: 'Otros', porcentaje: 10 },
  ]

  const masVendidos = [
    { nombre: 'Cilindro GLP 11 kg', categoria: 'Cilindros', precio: '$12.000', imagen: '/img/gasde11k.png' },
    { nombre: 'Cilindro GLP 5 kg', categoria: 'Cilindros', precio: '$6.500', imagen: '/img/gasde5k.png' },
  ]

  const menu = ['Dashboard', 'Productos', 'Usuarios', 'Pedidos']

  const fecha = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: '80vh' }}>

        {/* Menú lateral */}
        <div
          className="col-12 col-md-3 col-lg-2 p-3 text-white d-flex flex-column"
          style={{ background: 'linear-gradient(160deg, #fb923c, #f97316 50%, #ea580c)' }}
        >
          <h5 className="text-white fw-bold mb-4">Administración</h5>

          <div className="d-flex flex-md-column flex-wrap gap-1">
            {menu.map((item, indice) => (
              <button
                key={item}
                type="button"
                className="btn text-start text-white fw-semibold"
                style={{ background: indice === 0 ? 'rgba(255,255,255,0.25)' : 'transparent' }}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-light fw-bold mt-3 mt-md-auto"
            style={{ color: '#ea580c' }}
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>

        {/* Contenido principal */}
        <div className="col-12 col-md-9 col-lg-10 p-3 p-lg-4 bg-light">
          <div className="mb-4">
            <h1 className="mb-0">Dashboard</h1>
            <p className="text-muted text-capitalize">{fecha}</p>
          </div>

          {/* Tarjetas de resumen */}
          <div className="row g-3 mb-4">
            {resumen.map((r) => (
              <div className="col-12 col-md-4" key={r.titulo}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">{r.titulo}</p>
                    <h2 className="mb-0" style={{ color: '#f97316' }}>{r.valor}</h2>
                    <small className="text-muted">{r.detalle}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3">

            {/* Productos por categoría (barras de progreso) */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Productos por categoría</h5>
                  {categorias.map((c) => (
                    <div className="mb-3" key={c.nombre}>
                      <div className="d-flex justify-content-between small">
                        <span>{c.nombre}</span>
                        <span>{c.porcentaje}%</span>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: c.porcentaje + '%', backgroundColor: '#f97316' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de productos más vendidos */}
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Más vendidos</h5>
                  {masVendidos.map((p) => (
                    <div
                      className="d-flex align-items-center justify-content-between border-bottom py-2"
                      key={p.nombre}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img src={p.imagen} alt={p.nombre} width="48" height="48" style={{ objectFit: 'contain' }} />
                        <div>
                          <div className="fw-semibold">{p.nombre}</div>
                          <small className="text-muted">{p.categoria}</small>
                        </div>
                      </div>
                      <span className="texto-precio">{p.precio}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Administrador