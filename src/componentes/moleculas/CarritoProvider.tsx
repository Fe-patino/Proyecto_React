import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { CarritoContexto } from "./CarritoContexto";
import { obtenerProductos } from "../../productosService";
import type { ItemCarrito } from "../../paginas/Carrito";
import type { Producto } from "../../paginas/Productos";

export const CLAVE_STORAGE = "gasElVolcan_carrito";

function leerCarritoGuardado(): ItemCarrito[] {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? "[]");
    if (!Array.isArray(datos)) return [];
    // Los ids son numéricos (vienen de la base de datos); se acepta también un id guardado como texto numérico
    return datos
      .map((i) => ({ id: Number(i?.id), cantidad: i?.cantidad }))
      .filter((i): i is ItemCarrito => Number.isInteger(i.id) && Number.isInteger(i.cantidad) && i.cantidad >= 1);
  } catch {
    return [];
  }
}

interface CarritoProviderProps {
  children: ReactNode;
}

function CarritoProvider({ children }: CarritoProviderProps) {
  const [items, setItems] = useState<ItemCarrito[]>(leerCarritoGuardado);
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    obtenerProductos().then(setProductos).catch(() => setProductos([]))
  }, [])

  const stockDe = (id: number): number => {
    const p = productos.find((p) => p.id === id);
    return p?.stock ?? 0;
  }

  const actualizar = (nuevos: ItemCarrito[]) => {
    setItems(nuevos);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevos));
  };

  const agregar = (id: number): boolean => {
    const existente = items.find((i) => i.id === id);
    const actual = existente?.cantidad ?? 0;
    if (actual >= stockDe(id)) return false;

    actualizar(
      existente
        ? items.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i))
        : [...items, { id, cantidad: 1 }],
    );
    return true;
  };

  const quitar = (id: number) => actualizar(items.filter((i) => i.id !== id));

  const cambiarCantidad = (id: number, cantidad: number) => {
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
