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
export function crearSesion(tipo: string, correo: string, nombre: string, token: string): Sesion {
  const sesion: Sesion = { tipo, correo, nombre, token }
  guardarSesionLocal(sesion)
  return sesion
}

// Cabecera Authorization con el JWT de la sesión activa ({} si nadie ha iniciado sesión).
// Los microservicios de contacto y pagos la exigen en sus endpoints protegidos.
export function encabezadoAutorizacion(): Record<string, string> {
  const token = leerSesion()?.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}
