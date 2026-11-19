// Datos de quien inició sesión
export interface Sesion {
  tipo: string       // "cliente" o "administrador"
  correo: string
  nombre: string
  token: string      // JWT del backend
}

const CLAVE_SESION = 'gasElVolcan_sesion'

export function leerSesion(): Sesion | null {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_SESION) ?? 'null')
    if (datos && typeof datos.tipo === 'string' && typeof datos.token === 'string') return datos as Sesion
    return null
  } catch {
    return null
  }
}

export function guardarSesionLocal(sesion: Sesion | null) {
  try {
    if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
    else localStorage.removeItem(CLAVE_SESION)
  } catch {}
}