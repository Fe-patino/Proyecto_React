import { createContext } from "react";
import type { ItemCarrito } from "../../paginas/Carrito";

export interface CarritoContextoValor {
  items: ItemCarrito[];
  totalUnidades: number;
  // Devuelve false si no se pudo agregar (sin stock o ya está el máximo)
  agregar: (id: string) => boolean;
  quitar: (id: string) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  vaciar: () => void;
}

export const CarritoContexto = createContext<CarritoContextoValor | null>(null);
