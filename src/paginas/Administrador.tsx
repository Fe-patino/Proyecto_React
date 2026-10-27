import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  obtenerProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  CATEGORIAS,
} from '../productosService'
import type { Producto } from './Productos'

interface AdministradorProps {
  alCerrarSesion: () => void
}

type Vista = 'dashboard' | 'productos'

const IMÁGENES = [
  { ruta: '/img/balongas.png',               nombre: 'Balón de gas' },
  { ruta: '/img/carlamunos.png',             nombre: 'Carla Muños' },
  { ruta: '/img/carrito.png',                nombre: 'Carrito' },
  { ruta: '/img/Carroportacilindro11&15 kg.png', nombre: 'Carro portacilindro 11&15 kg' },
  { ruta: '/img/Cilindro.png',               nombre: 'Cilindro' },
  { ruta: '/img/detectorgas.png',            nombre: 'Detector de gas' },
  { ruta: '/img/gas3metros.png',             nombre: 'Gas 3 metros' },
  { ruta: '/img/gasde5k.png',                nombre: 'Gas 5 kg' },
  { ruta: '/img/gasde11k.png',               nombre: 'Gas 11 kg' },
  { ruta: '/img/gasde15k.png',               nombre: 'Gas 15 kg' },
  { ruta: '/img/Kitconexióncompleto.png',    nombre: 'Kit conexión completo' },
  { ruta: '/img/manguerade1,5.png',          nombre: 'Manguera 1,5 m' },
  { ruta: '/img/mangueras.png',              nombre: 'Mangueras' },
  { ruta: '/img/reguladordegasdomestico.png',nombre: 'Regulador doméstico' },
  { ruta: '/img/reguladordepresion.png',     nombre: 'Regulador de presión' },
  { ruta: '/img/reguladordual.png',          nombre: 'Regulador dual' },
  { ruta: '/img/reparto.png',                nombre: 'Reparto' },
  { ruta: '/img/Tapaprotectoraválvula.png',  nombre: 'Tapa protectora válvula' },
]

const VACÍO: Omit<Producto, 'id'> = {
  nombre: '',
  categoria: CATEGORIAS[0],
  precio: 0,
  precioComercial: 0,
  stock: 0,
  imagen: '',
  descripcionBreve: '',
  descripcionCompleta: '',
}

function Administrador({ alCerrarSesion }: AdministradorProps) {
  const navegar = useNavigate()
  const [vista, setVista] = useState<Vista>('dashboard')
  const [productos, setProductos] = useState<Producto[]>(obtenerProductos())
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Producto, 'id'>>(VACÍO)
  const [error, setError] = useState('')

  const cerrarSesion = () => {
    alCerrarSesion()
    navegar('/login')
  }

  /* ── Filtro de búsqueda ── */
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  )

  /* ── Formulario ── */
  const cambiarCampo = (campo: keyof typeof form, valor: string | number) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const abrirCrear = () => {
    setEditandoId(null)
    setForm(VACÍO)
    setError('')
    setMostrarFormulario(true)
  }

  const abrirEditar = (p: Producto) => {
    setEditandoId(p.id)
    const { id, ...resto } = p
    void id
    setForm(resto)
    setError('')
    setMostrarFormulario(true)
  }

  const cancelar = () => {
    setMostrarFormulario(false)
    setEditandoId(null)
    setForm(VACÍO)
    setError('')
  }

  const guardar = () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    if (form.precio <= 0)    { setError('El precio debe ser mayor a 0'); return }
    if (form.stock < 0)      { setError('El stock no puede ser negativo'); return }

    if (editandoId) {
      setProductos(actualizarProducto(editandoId, form))
    } else {
      setProductos(agregarProducto(form))
    }
    cancelar()
  }

  const eliminar = (id: string) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProductos(eliminarProducto(id))
    }
  }

  /* ── Datos para el dashboard ── */
  const resumen = [
    { titulo: 'Productos', valor: String(productos.length), detalle: 'en el catálogo' },
    { titulo: 'Categorías', valor: String(CATEGORIAS.length), detalle: 'disponibles' },
    { titulo: 'Stock total', valor: String(productos.reduce((s, p) => s + p.stock, 0)), detalle: 'unidades' },
  ]

  const fecha = new Date().toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: '80vh' }}>

        {/* ── Menú lateral ── */}
        <div
          className="col-12 col-md-3 col-lg-2 p-3 text-white d-flex flex-column"
          style={{ background: 'linear-gradient(160deg, #fb923c, #f97316 50%, #ea580c)' }}
        >
          <h5 className="text-white fw-bold mb-4">Administración</h5>
          <div className="d-flex flex-md-column flex-wrap gap-1">
            {(['dashboard', 'productos'] as Vista[]).map((v) => (
              <button
                key={v}
                type="button"
                className="btn text-start text-white fw-semibold text-capitalize"
                style={{ background: vista === v ? 'rgba(255,255,255,0.25)' : 'transparent' }}
                onClick={() => { setVista(v); setMostrarFormulario(false) }}
              >
                {v === 'dashboard' ? 'Dashboard' : 'Productos'}
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

        {/* ── Contenido ── */}
        <div className="col-12 col-md-9 col-lg-10 p-3 p-lg-4 bg-light">

          {/* DASHBOARD */}
          {vista === 'dashboard' && (
            <>
              <div className="mb-4">
                <h1 className="mb-0">Dashboard</h1>
                <p className="text-muted text-capitalize">{fecha}</p>
              </div>
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
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Productos por categoría</h5>
                  {CATEGORIAS.map((cat) => {
                    const total = productos.filter((p) => p.categoria === cat).length
                    const pct = productos.length ? Math.round((total / productos.length) * 100) : 0
                    return (
                      <div className="mb-3" key={cat}>
                        <div className="d-flex justify-content-between small">
                          <span>{cat}</span><span>{pct}%</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar" role="progressbar"
                            style={{ width: pct + '%', backgroundColor: '#f97316' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* PRODUCTOS */}
          {vista === 'productos' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h1 className="mb-0">Gestión de Productos</h1>
                {!mostrarFormulario && (
                  <button className="btn btn-warning fw-bold" onClick={abrirCrear}>
                    + Agregar producto
                  </button>
                )}
              </div>

              {/* ── Formulario crear / editar ── */}
              {mostrarFormulario && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="mb-3">{editandoId ? 'Editar producto' : 'Nuevo producto'}</h5>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label">Nombre *</label>
                        <input className="form-control" value={form.nombre}
                          onChange={(e) => cambiarCampo('nombre', e.target.value)} />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Categoría</label>
                        <select className="form-select" value={form.categoria}
                          onChange={(e) => cambiarCampo('categoria', e.target.value)}>
                          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">Precio *</label>
                        <input type="number" min="0" step="5000" className="form-control" placeholder="0"
                          value={form.precio === 0 ? '' : form.precio}
                          onChange={(e) => cambiarCampo('precio', Number(e.target.value))} />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">Precio comercial</label>
                        <input type="number" min="0" step="5000" className="form-control" placeholder="0"
                          value={form.precioComercial === 0 ? '' : form.precioComercial}
                          onChange={(e) => cambiarCampo('precioComercial', Number(e.target.value))} />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">Stock *</label>
                        <input type="number" min="0" className="form-control" placeholder="0"
                          value={form.stock === 0 ? '' : form.stock}
                          onChange={(e) => cambiarCampo('stock', Number(e.target.value))} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Descripción breve</label>
                        <input className="form-control" value={form.descripcionBreve}
                          onChange={(e) => cambiarCampo('descripcionBreve', e.target.value)} />
                      </div>
                      <div className="col-12 col-md-8">
                        <label className="form-label">Imagen</label>
                        <select className="form-select" value={form.imagen}
                          onChange={(e) => cambiarCampo('imagen', e.target.value)}>
                          <option value="">— Sin imagen —</option>
                          {IMÁGENES.map((img) => (
                            <option key={img.ruta} value={img.ruta}>{img.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 col-md-4 d-flex align-items-end">
                        {form.imagen
                          ? <img src={form.imagen} alt="preview" className="rounded border"
                              style={{ height: 80, objectFit: 'contain' }} />
                          : <div className="rounded border bg-white d-flex align-items-center justify-content-center text-muted"
                              style={{ height: 80, width: 80, fontSize: 12 }}>Sin imagen</div>
                        }
                      </div>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                      <button className="btn btn-warning fw-bold" onClick={guardar}>
                        {editandoId ? 'Guardar cambios' : 'Crear producto'}
                      </button>
                      <button className="btn btn-outline-secondary" onClick={cancelar}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Buscador ── */}
              <input
                className="form-control mb-3"
                placeholder="Buscar por nombre o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                data-testid="buscador-admin"
              />

              {/* ── Tabla de productos ── */}
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosFiltrados.length === 0 && (
                        <tr><td colSpan={7} className="text-center text-muted py-3">Sin resultados</td></tr>
                      )}
                      {productosFiltrados.map((p) => (
                        <tr key={p.id}>
                          <td><small className="text-muted">{p.id}</small></td>
                          <td>
                            {p.imagen
                              ? <img src={p.imagen} alt={p.nombre} style={{ height: 40, objectFit: 'contain' }} />
                              : <span className="text-muted small">—</span>
                            }
                          </td>
                          <td>{p.nombre}</td>
                          <td>{p.categoria}</td>
                          <td>${p.precio.toLocaleString('es-CL')}</td>
                          <td>{p.stock}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-outline-primary"
                                onClick={() => abrirEditar(p)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger"
                                onClick={() => eliminar(p.id)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Administrador