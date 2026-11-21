/* =========================================================
   productosService.ts — Fuente de datos de productos
   Conectado al backend ms-productos (puerto 8081)
   ========================================================= */
import type { Producto } from "./paginas/Productos";
import { leerSesion } from "./sesion";

// Categorías disponibles para filtrar productos
export const CATEGORIAS = [
  "Cilindros de Gas",
  "Reguladores",
  "Mangueras y Conexiones",
  "Accesorios",
];

// URL base del microservicio de productos
const URL_BASE = "http://localhost:8081/api/productos";

// Obtiene el token JWT de la sesión activa para autorizar peticiones
function obtenerToken(): string {
  return leerSesion()?.token ?? "";
}

// GET /api/productos — Devuelve todos los productos desde la base de datos
export async function obtenerProductos(): Promise<Producto[]> {
  const res = await fetch(URL_BASE);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

// GET /api/productos/{id} — Devuelve un producto por su ID
export async function obtenerProductoPorId(id: string): Promise<Producto | undefined> {
  const res = await fetch(`${URL_BASE}/${id}`);
  if (!res.ok) return undefined;
  return res.json();
}

// POST /api/productos — Crea un nuevo producto (requiere token de administrador)
export async function agregarProducto(datos: Omit<Producto, "id">): Promise<Producto[]> {
  await fetch(URL_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(datos),
  });
  return obtenerProductos();
}

// PUT /api/productos/{id} — Actualiza un producto existente (requiere token de administrador)
export async function actualizarProducto(id: number, cambios: Partial<Omit<Producto, "id">>): Promise<Producto[]> {
  await fetch(`${URL_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(cambios),
  });
  return obtenerProductos();
}

// DELETE /api/productos/{id} — Elimina un producto por ID (requiere token de administrador)
export async function eliminarProducto(id: number): Promise<Producto[]> {
  await fetch(`${URL_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  return obtenerProductos();
}
