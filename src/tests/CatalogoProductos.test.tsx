import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CatalogoProductos from "../componentes/organismos/CatalogoProductos";
import DetalleProducto from "../paginas/DetalleProducto";

const renderCatalogo = () =>
  render(
    <MemoryRouter>
      <CatalogoProductos />
    </MemoryRouter>,
  );

describe("CatalogoProductos (filtros de búsqueda)", () => {
  it("muestra los 14 productos al inicio", () => {
    renderCatalogo();
    expect(screen.getAllByRole("article")).toHaveLength(14);
  });

  it("el botón de categoría deja solo los productos de esa categoría", async () => {
    renderCatalogo();
    await userEvent.click(screen.getByRole("button", { name: "Reguladores" }));
    const tarjetas = screen.getAllByRole("article");
    expect(tarjetas).toHaveLength(3);
    tarjetas.forEach((t) => expect(within(t).getByText("Reguladores")).toBeInTheDocument());
  });

  it("el buscador filtra por texto", async () => {
    renderCatalogo();
    await userEvent.type(screen.getByLabelText("Buscar producto"), "detector");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Detector de gas a batería" })).toBeInTheDocument();
  });

  it("muestra un aviso cuando no hay coincidencias", async () => {
    renderCatalogo();
    await userEvent.type(screen.getByLabelText("Buscar producto"), "zzzz");
    expect(screen.getByText("No hay productos que coincidan con tu búsqueda.")).toBeInTheDocument();
  });

  it("agregar un producto muestra el aviso de confirmación", async () => {
    renderCatalogo();
    await userEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
    expect(screen.getByText("Cilindro GLP 5 kg agregado al carrito.")).toBeInTheDocument();
  });
});

describe("DetalleProducto (parámetro de ruta)", () => {
  const renderDetalle = (ruta: string) =>
    render(
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/producto/:id" element={<DetalleProducto />} />
        </Routes>
      </MemoryRouter>,
    );

  it("muestra el producto indicado en la URL", () => {
    renderDetalle("/producto/CL002");
    expect(screen.getByRole("heading", { name: "Cilindro GLP 11 kg" })).toBeInTheDocument();
    expect(screen.getByText("$12.000")).toBeInTheDocument();
  });

  it("un id inexistente muestra 'Producto no encontrado'", () => {
    renderDetalle("/producto/NOEXISTE");
    expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver a productos" })).toHaveAttribute("href", "/productos");
  });
});
