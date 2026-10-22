import { describe, it, expect } from "vitest";
import { CATEGORIAS, obtenerProductoPorId, obtenerProductos } from "../productosService";

describe("productosService", () => {
  it("obtenerProductos devuelve los 14 productos", () => {
    expect(obtenerProductos()).toHaveLength(14);
  });

  it("todos los productos pertenecen a una categoría conocida", () => {
    obtenerProductos().forEach((p) => expect(CATEGORIAS).toContain(p.categoria));
  });

  it("obtenerProductoPorId devuelve el producto o undefined si no existe", () => {
    expect(obtenerProductoPorId("CL002")?.nombre).toBe("Cilindro GLP 11 kg");
    expect(obtenerProductoPorId("NOEXISTE")).toBeUndefined();
  });

  it("devuelve copias: modificar el resultado no altera los datos", () => {
    const lista = obtenerProductos();
    lista[0].nombre = "ALTERADO";
    expect(obtenerProductoPorId("CL001")?.nombre).toBe("Cilindro GLP 5 kg");
  });
});
