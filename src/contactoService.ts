/* =========================================================
   contactoService.ts — Mensajes del formulario de contacto
   Conectado al backend ms-contacto (puerto 8083)
   ========================================================= */

import { encabezadoAutorizacion } from "./sesion";

// URL base del microservicio de contacto
const URL_BASE = "http://localhost:8083/api/contactos";

export type EstadoMensaje = "PENDIENTE" | "RESPONDIDO";

// Mensaje tal como lo devuelve ms-contacto
export interface MensajeContacto {
  id: number;
  nombreCompleto: string;
  correo: string;
  mensaje: string;
  estado: EstadoMensaje;
  fechaCreacion: string;
}

// Los más nuevos primero (el backend no garantiza el orden)
export function ordenarMasNuevosPrimero(mensajes: MensajeContacto[]): MensajeContacto[] {
  return [...mensajes].sort(
    (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
  );
}

// Cantidad de mensajes que aún no se responden
export function contarPendientes(mensajes: MensajeContacto[]): number {
  return mensajes.filter((m) => m.estado === "PENDIENTE").length;
}

// GET /api/contactos — Lista todos los mensajes recibidos (solo administrador: requiere token)
export async function obtenerMensajes(): Promise<MensajeContacto[]> {
  const res = await fetch(URL_BASE, { headers: encabezadoAutorizacion() });
  if (!res.ok) throw new Error("Error al obtener los mensajes");
  return ordenarMasNuevosPrimero(await res.json());
}

// PUT /api/contactos/{id}/estado?estado=... — Marca un mensaje como PENDIENTE o RESPONDIDO
export async function cambiarEstadoMensaje(id: number, estado: EstadoMensaje): Promise<MensajeContacto> {
  const res = await fetch(`${URL_BASE}/${id}/estado?estado=${estado}`, {
    method: "PUT",
    headers: encabezadoAutorizacion(),
  });
  if (!res.ok) throw new Error("Error al cambiar el estado del mensaje");
  return res.json();
}
