import type { Producto } from "./paginas/Productos";
import type { ItemCarrito, LineaCarrito } from "./paginas/Carrito";

// Une cada ítem guardado (id + cantidad) con los datos de su producto.
// Si un producto ya no existe en el catálogo, se omite.
export function armarLineas(items: ItemCarrito[], productos: Producto[]): LineaCarrito[] {
  return items.flatMap((item) => {
    const producto = productos.find((p) => p.id === item.id);
    return producto ? [{ producto, cantidad: item.cantidad }] : [];
  });
}

// Suma precio x cantidad de todas las líneas
export function calcularTotal(lineas: LineaCarrito[]): number {
  return lineas.reduce((total, l) => total + l.producto.precio * l.cantidad, 0);
}
