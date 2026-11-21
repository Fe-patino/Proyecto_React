import { createContext } from "react";
import type { ItemCarrito } from "../../paginas/Carrito";

export interface CarritoContextoValor {
  items: ItemCarrito[];
  totalUnidades: number;
  // Devuelve false si no se pudo agregar (sin stock o ya está el máximo)
  agregar: (id: number) => boolean;
  quitar: (id: number) => void;
  cambiarCantidad: (id: number, cantidad: number) => void;
  vaciar: () => void;
}

export const CarritoContexto = createContext<CarritoContextoValor | null>(null);
