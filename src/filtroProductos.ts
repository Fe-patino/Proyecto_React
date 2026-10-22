import type { Producto } from "./paginas/Productos";

export interface FiltroProductos {
  categoria: string; // "Todos" o el nombre de una categoría
  texto: string;
}

// Quita tildes y pasa a minúsculas para que "domestico" encuentre "doméstico"
const normalizar = (t: string) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Función pura: recibe la lista y el filtro y devuelve la lista filtrada
export function filtrarProductos(productos: Producto[], filtro: FiltroProductos): Producto[] {
  const texto = normalizar(filtro.texto);
  return productos.filter((p) => {
    const coincideCategoria = filtro.categoria === "Todos" || p.categoria === filtro.categoria;
    const coincideTexto =
      texto === "" ||
      normalizar(p.nombre).includes(texto) ||
      normalizar(p.id).includes(texto) ||
      normalizar(p.descripcionBreve).includes(texto);
    return coincideCategoria && coincideTexto;
  });
}
