import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListaProductos from "../componentes/organismos/ListaProductos";
import { obtenerProductos } from "../productosService";

describe("ListaProductos", () => {
  it("muestra una tarjeta por cada producto recibido", () => {
    const productos = obtenerProductos();
    render(
      <MemoryRouter>
        <ListaProductos productos={productos} />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole("article")).toHaveLength(14);
    productos.forEach((p) => expect(screen.getByRole("heading", { name: p.nombre })).toBeInTheDocument());
  });

  it("muestra el mensaje indicado cuando la lista está vacía", () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={[]} mensajeVacio="Sin resultados" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
