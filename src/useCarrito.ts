import { useContext } from "react";
import { CarritoContexto } from "./componentes/moleculas/carritoContexto";

// Acceso al carrito desde cualquier componente: const { items, agregar } = useCarrito()
export function useCarrito() {
  const contexto = useContext(CarritoContexto);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return contexto;
}
