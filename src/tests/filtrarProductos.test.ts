import { describe, it, expect } from "vitest";
import { filtrarProductos } from "../filtroProductos";
import { obtenerProductos } from "../productosService";

describe("filtrarProductos", () => {
  const productos = obtenerProductos();

  it("con categoría 'Todos' y sin texto devuelve los 14 productos", () => {
    expect(filtrarProductos(productos, { categoria: "Todos", texto: "" })).toHaveLength(14);
  });

  it("filtra por categoría", () => {
    const r = filtrarProductos(productos, { categoria: "Reguladores", texto: "" });
    expect(r).toHaveLength(3);
    expect(r.every((p) => p.categoria === "Reguladores")).toBe(true);
  });

  it("busca por texto ignorando mayúsculas y tildes", () => {
    const r = filtrarProductos(productos, { categoria: "Todos", texto: "DOMESTICO" });
    expect(r.map((p) => p.id)).toContain("RG001");
  });

  it("combina categoría y texto", () => {
    const r = filtrarProductos(productos, { categoria: "Accesorios", texto: "detector" });
    expect(r.map((p) => p.id)).toEqual(["AC003"]);
  });

  it("devuelve una lista vacía cuando nada coincide", () => {
    expect(filtrarProductos(productos, { categoria: "Todos", texto: "zzzz" })).toEqual([]);
  });
});
