/* =========================================================
   usuariosService.ts — Gestión de usuarios (solo administrador)
   Conectado al backend ms-autenticacion (puerto 8082)
   ========================================================= */

import { encabezadoAutorizacion } from "./sesion";

// URL base de los endpoints de usuarios
const URL_BASE = "http://localhost:8082/api/auth/usuarios";

export type RolUsuario = "CLIENTE" | "ADMINISTRADOR";

// Usuario tal como lo devuelve ms-autenticacion (la contraseña nunca viaja)
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

// Datos para crear un usuario desde el panel
export interface NuevoUsuario {
  nombre: string;
  correo: string;
  password: string;
  rol: RolUsuario;
}

// Traduce el código HTTP del backend a un mensaje para mostrar en pantalla
function mensajeDeError(status: number): string {
  if (status === 409) return "El correo ya está registrado.";
  if (status === 400) return "Los datos del usuario no son válidos.";
  if (status === 401 || status === 403) return "No tienes permisos de administrador para esta acción.";
  return "No se pudo completar la operación.";
}

// GET /api/auth/usuarios — Lista todos los usuarios
export async function obtenerUsuarios(): Promise<Usuario[]> {
  const res = await fetch(URL_BASE, { headers: encabezadoAutorizacion() });
  if (!res.ok) throw new Error(mensajeDeError(res.status));
  return res.json();
}

// POST /api/auth/usuarios — Crea un usuario con el rol elegido
export async function crearUsuario(datos: NuevoUsuario): Promise<Usuario> {
  const res = await fetch(URL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...encabezadoAutorizacion() },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(mensajeDeError(res.status));
  return res.json();
}

// DELETE /api/auth/usuarios/{id} — Elimina un usuario
export async function eliminarUsuario(id: number): Promise<void> {
  const res = await fetch(`${URL_BASE}/${id}`, {
    method: "DELETE",
    headers: encabezadoAutorizacion(),
  });
  if (!res.ok) throw new Error(mensajeDeError(res.status));
}
