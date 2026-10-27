// Datos de quien inició sesión
export interface Sesion {
  tipo: string // "cliente" o "administrador"
  correo: string
  nombre: string
}

const CLAVE_SESION = 'gasElVolcan_sesion'

// "felix.patino@correo.cl" -> "Felix patino"
export function nombreDesdeCorreo(correo: string): string {
  const base = correo.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuario'
}

export function crearSesion(tipo: string, correo: string): Sesion {
  return { tipo, correo, nombre: nombreDesdeCorreo(correo) }
}

// Lee la sesión guardada; si no hay nada o está dañada, nadie ha iniciado sesión
export function leerSesion(): Sesion | null {
  try {
    const datos = JSON.parse(sessionStorage.getItem(CLAVE_SESION) ?? 'null')
    if (datos && typeof datos.tipo === 'string' && typeof datos.nombre === 'string') return datos as Sesion
    return null
  } catch {
    return null
  }
}

export function guardarSesionLocal(sesion: Sesion | null) {
  try {
    if (sesion) sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
    else sessionStorage.removeItem(CLAVE_SESION)
  } catch {
    // si el navegador bloquea el almacenamiento, la sesión dura mientras no se recargue
  }
}