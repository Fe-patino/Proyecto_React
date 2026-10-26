import { useState } from "react";
import type { ReactNode } from "react";
import { CarritoContexto } from "./CarritoContexto";
import { obtenerProductoPorId } from "../../productosService";
import type { ItemCarrito } from "../../paginas/Carrito";

export const CLAVE_STORAGE = "gasElVolcan_carrito";

// Lee el carrito guardado en LocalStorage; si no hay nada o está dañado, parte vacío
function leerCarritoGuardado(): ItemCarrito[] {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? "[]");
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (i): i is ItemCarrito => typeof i?.id === "string" && Number.isInteger(i?.cantidad) && i.cantidad >= 1,
    );
  } catch {
    return [];
  }
}

const stockDe = (id: string) => obtenerProductoPorId(id)?.stock ?? 0;

interface CarritoProviderProps {
  children: ReactNode;
}

// Guarda el estado del carrito con useState y lo comparte con toda la aplicación.
// Se guarda también en LocalStorage para que no se pierda al recargar la página.
function CarritoProvider({ children }: CarritoProviderProps) {
  const [items, setItems] = useState<ItemCarrito[]>(leerCarritoGuardado);

  const actualizar = (nuevos: ItemCarrito[]) => {
    setItems(nuevos);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevos));
  };

  const agregar = (id: string): boolean => {
    const existente = items.find((i) => i.id === id);
    const actual = existente?.cantidad ?? 0;
    if (actual >= stockDe(id)) return false; // sin stock o ya llegó al máximo

    actualizar(
      existente
        ? items.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i))
        : [...items, { id, cantidad: 1 }],
    );
    return true;
  };

  const quitar = (id: string) => actualizar(items.filter((i) => i.id !== id));

  // La cantidad siempre queda entre 1 y el stock disponible
  const cambiarCantidad = (id: string, cantidad: number) => {
    const entera = Number.isNaN(cantidad) ? 1 : Math.floor(cantidad);
    const maximo = Math.max(stockDe(id), 1);
    const valida = Math.min(Math.max(entera, 1), maximo);
    actualizar(items.map((i) => (i.id === id ? { ...i, cantidad: valida } : i)));
  };

  const vaciar = () => actualizar([]);

  const totalUnidades = items.reduce((total, i) => total + i.cantidad, 0);

  return (
    <CarritoContexto.Provider value={{ items, totalUnidades, agregar, quitar, cambiarCantidad, vaciar }}>
      {children}
    </CarritoContexto.Provider>
  );
}

export default CarritoProvider;
