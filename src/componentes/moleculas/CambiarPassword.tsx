import { useState } from 'react'
import type { Sesion } from '../../sesion'

interface Props {
  sesion: Sesion
}

function CambiarPassword({ sesion }: Props) {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'danger' } | null>(null)
  const [cargando, setCargando] = useState(false)

  const manejar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (nueva !== confirmacion) {
      setMensaje({ texto: 'Las contraseñas nuevas no coinciden', tipo: 'danger' })
      return
    }
    setCargando(true)
    try {
      const res = await fetch('http://localhost:8082/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sesion.token}`
        },
        body: JSON.stringify({ passwordActual: actual, passwordNueva: nueva })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMensaje({ texto: err.message ?? 'Error al cambiar contraseña', tipo: 'danger' })
      } else {
        setMensaje({ texto: '¡Contraseña actualizada correctamente!', tipo: 'success' })
        setActual(''); setNueva(''); setConfirmacion('')
      }
    } catch {
      setMensaje({ texto: 'No se pudo conectar con el servidor', tipo: 'danger' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={manejar}>
      {mensaje && <div className={`alert alert-${mensaje.tipo} py-2`}>{mensaje.texto}</div>}
      <div className="mb-2">
        <input className="form-control form-control-sm" type="password"
          placeholder="Contraseña actual" value={actual}
          onChange={e => setActual(e.target.value)} required />
      </div>
      <div className="mb-2">
        <input className="form-control form-control-sm" type="password"
          placeholder="Nueva contraseña" value={nueva}
          onChange={e => setNueva(e.target.value)} required />
      </div>
      <div className="mb-3">
        <input className="form-control form-control-sm" type="password"
          placeholder="Confirmar nueva contraseña" value={confirmacion}
          onChange={e => setConfirmacion(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-sm fw-semibold text-white"
        style={{ backgroundColor: '#f97316', borderColor: '#f97316' }} disabled={cargando}>
        {cargando ? 'Guardando...' : 'Cambiar contraseña'}
      </button>
    </form>
  )
}

export default CambiarPassword