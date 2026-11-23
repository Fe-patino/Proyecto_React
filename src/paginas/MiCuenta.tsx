import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Sesion } from '../sesion'

interface MiCuentaProps {
  sesion: Sesion
}

interface Pago {
  id: number
  nombreCliente: string
  correoCliente: string
  total: number
  ultimosDigitos: string
  estado: string
}

interface Contacto {
  id: number
  nombre: string
  correo: string
  mensaje: string
  respuesta?: string
}

function MiCuenta({ sesion }: MiCuentaProps) {
  const [seccion, setSeccion] = useState<'perfil' | 'pedidos' | 'mensajes'>('perfil')
  const [pagos, setPagos] = useState<Pago[]>([])
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [cargandoPagos, setCargandoPagos] = useState(false)
  const [cargandoMensajes, setCargandoMensajes] = useState(false)

  useEffect(() => {
    if (seccion === 'pedidos') {
      setCargandoPagos(true)
      fetch('http://localhost:8085/api/pagos')
        .then(r => r.json())
        .then((data: Pago[]) => {
          const misPagos = data.filter(
            p => p.correoCliente?.toLowerCase() === sesion.correo?.toLowerCase()
          )
          setPagos(misPagos)
        })
        .catch(() => setPagos([]))
        .finally(() => setCargandoPagos(false))
    }
    if (seccion === 'mensajes') {
      setCargandoMensajes(true)
      fetch('http://localhost:8083/api/contactos')
        .then(r => r.json())
        .then((data: Contacto[]) => {
          const misMensajes = data.filter(
            c => c.correo?.toLowerCase() === sesion.correo?.toLowerCase()
          )
          setContactos(misMensajes)
        })
        .catch(() => setContactos([]))
        .finally(() => setCargandoMensajes(false))
    }
  }, [seccion, sesion.correo])

  return (
    <div className="container my-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-3 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="text-center mb-3">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                style={{ width: 64, height: 64, backgroundColor: '#f97316', color: 'white', fontSize: 28, fontWeight: 'bold' }}
              >
                {sesion.nombre?.charAt(0).toUpperCase()}
              </div>
              <p className="fw-bold mb-0">{sesion.nombre}</p>
              <p className="text-muted small">{sesion.correo}</p>
              <span className="badge" style={{ backgroundColor: '#f97316' }}>
                {sesion.tipo?.toUpperCase() === 'ADMINISTRADOR' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
            <hr />
            <div className="d-grid gap-2">
              <button
                className={`btn btn-sm text-start ${seccion === 'perfil' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setSeccion('perfil')}
              >
                👤 Mi perfil
              </button>
              <button
                className={`btn btn-sm text-start ${seccion === 'pedidos' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setSeccion('pedidos')}
              >
                📦 Mis pedidos
              </button>
              <button
                className={`btn btn-sm text-start ${seccion === 'mensajes' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setSeccion('mensajes')}
              >
                ✉️ Mis mensajes
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="col-12 col-md-9">

          {/* PERFIL */}
          {seccion === 'perfil' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-4">Mi perfil</h4>
              <div className="mb-3">
                <p className="text-muted mb-1 small">Nombre</p>
                <p className="fw-semibold fs-5">{sesion.nombre}</p>
              </div>
              <div className="mb-3">
                <p className="text-muted mb-1 small">Correo electrónico</p>
                <p className="fw-semibold fs-5">{sesion.correo}</p>
              </div>
              <div className="mb-4">
                <p className="text-muted mb-1 small">Tipo de cuenta</p>
                <p className="fw-semibold fs-5 text-capitalize">
                  {sesion.tipo?.toUpperCase() === 'ADMINISTRADOR' ? 'Administrador' : 'Cliente'}
                </p>
              </div>
              <Link className="btn fw-semibold text-white" to="/productos" style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}>
                Seguir comprando
              </Link>
            </div>
          )}

          {/* PEDIDOS */}
          {seccion === 'pedidos' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-4">Mis pedidos</h4>
              {cargandoPagos ? (
                <div className="text-center py-4">
                  <div className="spinner-border" style={{ color: '#f97316' }} role="status" />
                  <p className="mt-2 text-muted">Cargando pedidos...</p>
                </div>
              ) : pagos.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No tienes pedidos registrados aún.</p>
                  <Link to="/productos" className="btn btn-sm fw-semibold text-white" style={{ backgroundColor: '#f97316' }}>
                    Ver productos
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {pagos.map(pago => (
                    <div key={pago.id} className="border rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="fw-bold mb-1">Pedido #{pago.id}</p>
                          <p className="text-muted small mb-1">Tarjeta terminada en •••• {pago.ultimosDigitos}</p>
                          <p className="fw-semibold mb-0" style={{ color: '#f97316' }}>
                            ${pago.total?.toLocaleString('es-CL')}
                          </p>
                        </div>
                        <span className={`badge ${pago.estado === 'COMPLETADO' ? 'bg-success' : 'bg-warning'}`}>
                          {pago.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MENSAJES */}
          {seccion === 'mensajes' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-4">Mis mensajes</h4>
              {cargandoMensajes ? (
                <div className="text-center py-4">
                  <div className="spinner-border" style={{ color: '#f97316' }} role="status" />
                  <p className="mt-2 text-muted">Cargando mensajes...</p>
                </div>
              ) : contactos.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No tienes mensajes enviados aún.</p>
                  <Link to="/contacto" className="btn btn-sm fw-semibold text-white" style={{ backgroundColor: '#f97316' }}>
                    Enviar mensaje
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {contactos.map(c => (
                    <div key={c.id} className="border rounded-3 p-3">
                      <p className="fw-bold mb-1">Mensaje #{c.id}</p>
                      <p className="text-muted small mb-2">Tu mensaje:</p>
                      <p className="mb-2">{c.mensaje}</p>
                      {c.respuesta ? (
                        <div className="alert alert-success py-2 mb-0">
                          <p className="text-muted small mb-1">✅ Respuesta del equipo:</p>
                          <p className="mb-0">{c.respuesta}</p>
                        </div>
                      ) : (
                        <div className="alert alert-warning py-2 mb-0">
                          <p className="mb-0 small">⏳ Pendiente de respuesta</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default MiCuenta