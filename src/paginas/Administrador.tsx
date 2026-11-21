import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  obtenerProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  CATEGORIAS,
} from '../productosService'
import type { Producto } from './Productos'

import { encabezadoAutorizacion, leerSesion } from '../sesion'
import { obtenerUsuarios, crearUsuario, eliminarUsuario } from '../usuariosService'
import type { Usuario, RolUsuario } from '../usuariosService'
import {
  obtenerMensajes,
  cambiarEstadoMensaje,
  contarPendientes,
} from '../contactoService'
import type { MensajeContacto } from '../contactoService'

interface AdministradorProps {
  alCerrarSesion: () => void
}

type Vista = 'dashboard' | 'productos' | 'pagos' | 'mensajes' | 'usuarios'

type FiltroMensajes = 'TODOS' | 'PENDIENTE' | 'RESPONDIDO'

// Cada cuántos milisegundos se revisan los mensajes nuevos mientras el panel está abierto
const INTERVALO_MENSAJES = 15000

interface Pago {
  id: number
  nombreCliente: string
  correoCliente: string
  total: number
  ultimosDigitos: string
  estado: string
  fechaPago: string
}

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
  // Productos se carga desde el backend al montar el componente
  const [productos, setProductos] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Producto, 'id'>>(VACÍO)
  const [error, setError] = useState('')

  // Estado para pagos
  const [pagos, setPagos] = useState<Pago[]>([])
  const [cargandoPagos, setCargandoPagos] = useState(false)
  const [errorPagos, setErrorPagos] = useState('')

  // Estado para mensajes de contacto
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([])
  const [cargandoMensajes, setCargandoMensajes] = useState(true)
  const [errorMensajes, setErrorMensajes] = useState('')
  const [filtroMensajes, setFiltroMensajes] = useState<FiltroMensajes>('TODOS')

  // Estado para usuarios (crear clientes y administradores)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false)
  const [errorUsuarios, setErrorUsuarios] = useState('')
  const [formUsuario, setFormUsuario] = useState<{ nombre: string; correo: string; password: string; rol: RolUsuario }>(
    { nombre: '', correo: '', password: '', rol: 'CLIENTE' },
  )
  const [errorFormUsuario, setErrorFormUsuario] = useState('')

  // Cargar productos desde ms-productos al montar el componente
  useEffect(() => {
    obtenerProductos().then(setProductos).catch(() => setProductos([]))
  }, [])

  // Mensajes de contacto: se cargan al abrir el panel y se revisan cada pocos segundos,
  // así al administrador le llegan los mensajes nuevos sin recargar la página
  const cargarMensajes = () => {
    obtenerMensajes()
      .then((datos) => { setMensajes(datos); setErrorMensajes('') })
      .catch(() => setErrorMensajes('No se pudieron cargar los mensajes. Verifica que ms-contacto esté corriendo.'))
      .finally(() => setCargandoMensajes(false))
  }

  useEffect(() => {
    cargarMensajes()
    const temporizador = setInterval(cargarMensajes, INTERVALO_MENSAJES)
    return () => clearInterval(temporizador)
  }, [])

  const alternarEstadoMensaje = (m: MensajeContacto) => {
    const nuevo = m.estado === 'PENDIENTE' ? 'RESPONDIDO' : 'PENDIENTE'
    cambiarEstadoMensaje(m.id, nuevo)
      .then((actualizado) => setMensajes((prev) => prev.map((x) => (x.id === actualizado.id ? actualizado : x))))
      .catch(() => alert('No se pudo cambiar el estado del mensaje'))
  }

  const pendientes = contarPendientes(mensajes)
  const mensajesFiltrados = mensajes.filter((m) => filtroMensajes === 'TODOS' || m.estado === filtroMensajes)

  useEffect(() => {
    if (vista === 'pagos') {
      setCargandoPagos(true)
      fetch('http://localhost:8085/api/pagos', { headers: encabezadoAutorizacion() })
        .then((res) => { if (!res.ok) throw new Error(); return res.json() })
        .then((datos) => setPagos(datos))
        .catch(() => setErrorPagos('No se pudieron cargar los pagos.'))
        .finally(() => setCargandoPagos(false))
    }
  }, [vista])

  // Usuarios: se cargan al abrir la vista
  const cargarUsuarios = () => {
    setCargandoUsuarios(true)
    obtenerUsuarios()
      .then((datos) => { setUsuarios(datos); setErrorUsuarios('') })
      .catch((e: Error) => setErrorUsuarios(e.message || 'No se pudieron cargar los usuarios.'))
      .finally(() => setCargandoUsuarios(false))
  }

  useEffect(() => {
    if (vista === 'usuarios') cargarUsuarios()
  }, [vista])

  const guardarUsuario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { nombre, correo, password } = formUsuario
    if (nombre.trim().length < 3) { setErrorFormUsuario('El nombre debe tener al menos 3 caracteres'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { setErrorFormUsuario('Ingrese un correo válido'); return }
    if (password.length < 4 || password.length > 20) { setErrorFormUsuario('La contraseña debe tener entre 4 y 20 caracteres'); return }
    setErrorFormUsuario('')
    crearUsuario(formUsuario)
      .then(() => {
        setFormUsuario({ nombre: '', correo: '', password: '', rol: 'CLIENTE' })
        cargarUsuarios()
      })
      .catch((err: Error) => setErrorFormUsuario(err.message))
  }

  const borrarUsuario = (u: Usuario) => {
    if (!window.confirm(`¿Eliminar al usuario ${u.nombre} (${u.correo})?`)) return
    eliminarUsuario(u.id)
      .then(cargarUsuarios)
      .catch((err: Error) => alert(err.message))
  }
  
  const cerrarSesion = () => {
    alCerrarSesion()
    navegar('/login')
  }

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  )

  const cambiarCampo = (campo: keyof typeof form, valor: string | number) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const abrirCrear = () => { setEditandoId(null); setForm(VACÍO); setError(''); setMostrarFormulario(true) }

  const abrirEditar = (p: Producto) => {
    setEditandoId(p.id)
    const { id, ...resto } = p
    void id
    setForm(resto)
    setError('')
    setMostrarFormulario(true)
  }

  const cancelar = () => { setMostrarFormulario(false); setEditandoId(null); setForm(VACÍO); setError('') }

  const guardar = () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    if (form.precio <= 0)    { setError('El precio debe ser mayor a 0'); return }
    if (form.stock < 0)      { setError('El stock no puede ser negativo'); return }
    if (editandoId) {
      actualizarProducto(editandoId, form)
        .then(setProductos)
        .catch(() => setError('Error al actualizar el producto'))
    } else {
      agregarProducto(form)
        .then(setProductos)
        .catch(() => setError('Error al crear el producto'))
    }
    cancelar()
  }

  const eliminar = (id: number) => {
    if (window.confirm('¿Eliminar este producto?')) {
      eliminarProducto(id)
        .then(setProductos)
        .catch(() => alert('Error al eliminar el producto'))
    }
  }

  const resumen = [
    { titulo: 'Productos', valor: String(productos.length), detalle: 'en el catálogo' },
    { titulo: 'Categorías', valor: String(CATEGORIAS.length), detalle: 'disponibles' },
    { titulo: 'Stock total', valor: String(productos.reduce((s, p) => s + p.stock, 0)), detalle: 'unidades' },
    { titulo: 'Mensajes pendientes', valor: String(pendientes), detalle: 'por responder' },
  ]

  const fecha = new Date().toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
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
            {(['dashboard', 'productos', 'pagos', 'mensajes', 'usuarios'] as Vista[]).map((v) => (
              <button
                key={v}
                type="button"
                className="btn text-start text-white fw-semibold text-capitalize"
                style={{ background: vista === v ? 'rgba(255,255,255,0.25)' : 'transparent' }}
                onClick={() => { setVista(v); setMostrarFormulario(false) }}
              >
                {v === 'dashboard' ? 'Dashboard' : v === 'productos' ? 'Productos' : v === 'pagos' ? 'Pagos' : v === 'mensajes' ? 'Mensajes' : 'Usuarios'}
                {v === 'mensajes' && pendientes > 0 && (
                  <span className="badge bg-light ms-2" style={{ color: '#ea580c' }} data-testid="contador-mensajes">
                    {pendientes}
                  </span>
                )}
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

        {/* Contenido */}
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
                  <div className="col-12 col-md-6 col-lg-3" key={r.titulo}>
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
                      <button className="btn btn-outline-secondary" onClick={cancelar}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
              <input
                className="form-control mb-3"
                placeholder="Buscar por nombre o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                data-testid="buscador-admin"
              />
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th><th>Imagen</th><th>Nombre</th>
                        <th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th>
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
                              : <span className="text-muted small">—</span>}
                          </td>
                          <td>{p.nombre}</td>
                          <td>{p.categoria}</td>
                          <td>${p.precio.toLocaleString('es-CL')}</td>
                          <td>{p.stock}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => abrirEditar(p)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p.id)}>Eliminar</button>
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

          {/* MENSAJES DE CONTACTO */}
          {vista === 'mensajes' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h1 className="mb-0">Mensajes de clientes</h1>
                  <p className="text-muted mb-0">
                    Enviados desde el formulario de contacto · {pendientes} pendiente{pendientes === 1 ? '' : 's'}
                  </p>
                </div>
                <button className="btn btn-outline-secondary" onClick={cargarMensajes}>Actualizar</button>
              </div>
              <div className="btn-group mb-3" role="group" aria-label="Filtrar mensajes">
                {(['TODOS', 'PENDIENTE', 'RESPONDIDO'] as FiltroMensajes[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={'btn btn-sm ' + (filtroMensajes === f ? 'btn-warning fw-bold' : 'btn-outline-secondary')}
                    onClick={() => setFiltroMensajes(f)}
                  >
                    {f === 'TODOS' ? 'Todos' : f === 'PENDIENTE' ? 'Pendientes' : 'Respondidos'}
                  </button>
                ))}
              </div>
              {cargandoMensajes && <p className="text-muted">Cargando mensajes...</p>}
              {errorMensajes && <p className="text-danger">{errorMensajes}</p>}
              {!cargandoMensajes && !errorMensajes && (
                <div className="card border-0 shadow-sm">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Fecha</th><th>Cliente</th><th>Mensaje</th><th>Estado</th><th>Acción</th>
                        </tr>
                      </thead>
                      <tbody data-testid="tabla-mensajes">
                        {mensajesFiltrados.length === 0 && (
                          <tr><td colSpan={5} className="text-center text-muted py-3">Sin mensajes</td></tr>
                        )}
                        {mensajesFiltrados.map((m) => (
                          <tr key={m.id}>
                            <td><small>{new Date(m.fechaCreacion).toLocaleString('es-CL')}</small></td>
                            <td>
                              <div className="fw-semibold">{m.nombreCompleto}</div>
                              <a href={'mailto:' + m.correo} className="small">{m.correo}</a>
                            </td>
                            <td style={{ whiteSpace: 'pre-wrap', maxWidth: 420 }}>{m.mensaje}</td>
                            <td>
                              <span
                                className="badge"
                                style={{ backgroundColor: m.estado === 'PENDIENTE' ? '#f97316' : '#198754' }}
                              >
                                {m.estado === 'PENDIENTE' ? 'Pendiente' : 'Respondido'}
                              </span>
                            </td>
                            <td>
                              <button
                                className={'btn btn-sm ' + (m.estado === 'PENDIENTE' ? 'btn-outline-success' : 'btn-outline-secondary')}
                                onClick={() => alternarEstadoMensaje(m)}
                              >
                                {m.estado === 'PENDIENTE' ? 'Marcar respondido' : 'Marcar pendiente'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* USUARIOS */}
          {vista === 'usuarios' && (
            <>
              <div className="mb-3">
                <h1 className="mb-0">Usuarios</h1>
                <p className="text-muted mb-0">Crea cuentas de cliente o de administrador</p>
              </div>

              <form className="card border-0 shadow-sm mb-4" onSubmit={guardarUsuario} data-testid="form-usuario">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="usuario-nombre">Nombre completo</label>
                      <input
                        id="usuario-nombre"
                        className="form-control"
                        value={formUsuario.nombre}
                        onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="usuario-correo">Correo electrónico</label>
                      <input
                        id="usuario-correo"
                        type="email"
                        className="form-control"
                        value={formUsuario.correo}
                        onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="usuario-password">Contraseña (4 a 20 caracteres)</label>
                      <input
                        id="usuario-password"
                        type="password"
                        className="form-control"
                        value={formUsuario.password}
                        onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="usuario-rol">Tipo de usuario</label>
                      <select
                        id="usuario-rol"
                        className="form-select"
                        value={formUsuario.rol}
                        onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value as RolUsuario })}
                      >
                        <option value="CLIENTE">Cliente</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                      </select>
                    </div>
                  </div>
                  {errorFormUsuario && <p className="text-danger mt-3 mb-0">{errorFormUsuario}</p>}
                  <button type="submit" className="btn btn-warning fw-bold mt-3">Crear usuario</button>
                </div>
              </form>

              {cargandoUsuarios && <p className="text-muted">Cargando usuarios...</p>}
              {errorUsuarios && <p className="text-danger">{errorUsuarios}</p>}
              {!cargandoUsuarios && !errorUsuarios && (
                <div className="card border-0 shadow-sm">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Nombre</th><th>Correo</th><th>Tipo</th><th>Acción</th>
                        </tr>
                      </thead>
                      <tbody data-testid="tabla-usuarios">
                        {usuarios.length === 0 && (
                          <tr><td colSpan={4} className="text-center text-muted py-3">Sin usuarios</td></tr>
                        )}
                        {usuarios.map((u) => (
                          <tr key={u.id}>
                            <td>{u.nombre}</td>
                            <td>{u.correo}</td>
                            <td>
                              <span
                                className="badge"
                                style={{ backgroundColor: u.rol === 'ADMINISTRADOR' ? '#ea580c' : '#6c757d' }}
                              >
                                {u.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Cliente'}
                              </span>
                            </td>
                            <td>
                              {u.correo === leerSesion()?.correo ? (
                                <small className="text-muted">Tu cuenta</small>
                              ) : (
                                <button className="btn btn-sm btn-outline-danger" onClick={() => borrarUsuario(u)}>
                                  Eliminar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* PAGOS */}
          {vista === 'pagos' && (
            <>
              <div className="mb-4">
                <h1 className="mb-0">Registro de Pagos</h1>
                <p className="text-muted">Historial de todos los pagos realizados</p>
              </div>
              {cargandoPagos && <p className="text-muted">Cargando pagos...</p>}
              {errorPagos && <p className="text-danger">{errorPagos}</p>}
              {!cargandoPagos && !errorPagos && (
                <div className="card border-0 shadow-sm">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th><th>Cliente</th><th>Correo</th>
                          <th>Total</th><th>Tarjeta</th><th>Estado</th><th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagos.length === 0 && (
                          <tr><td colSpan={7} className="text-center text-muted py-3">Sin pagos registrados</td></tr>
                        )}
                        {pagos.map((p) => (
                          <tr key={p.id}>
                            <td><small className="text-muted">{p.id}</small></td>
                            <td>{p.nombreCliente}</td>
                            <td>{p.correoCliente}</td>
                            <td>${p.total.toLocaleString('es-CL')}</td>
                            <td>••••{p.ultimosDigitos}</td>
                            <td>
                              <span className="badge" style={{ backgroundColor: '#f97316' }}>
                                {p.estado}
                              </span>
                            </td>
                            <td><small>{new Date(p.fechaPago).toLocaleString('es-CL')}</small></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default Administrador
