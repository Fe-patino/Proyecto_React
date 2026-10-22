import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CardProducto from "../componentes/moleculas/CardProducto";
import { obtenerProductoPorId } from "../productosService";

const producto = obtenerProductoPorId("CL002")!; // Cilindro GLP 11 kg, $12.000

const renderCard = (props: Partial<React.ComponentProps<typeof CardProducto>> = {}) =>
  render(
    <MemoryRouter>
      <CardProducto producto={producto} {...props} />
    </MemoryRouter>,
  );

describe("CardProducto", () => {
  it("muestra nombre, categoría, precio formateado e imagen", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: "Cilindro GLP 11 kg" })).toBeInTheDocument();
    expect(screen.getByText("Cilindros de Gas")).toBeInTheDocument();
    expect(screen.getByText("$12.000")).toBeInTheDocument();
    expect(screen.getByAltText("Cilindro GLP 11 kg")).toHaveAttribute("src", "/img/gasde11k.png");
  });

  it("incluye el enlace al detalle con el id del producto", () => {
    renderCard();
    expect(screen.getByRole("link", { name: "Ver Producto" })).toHaveAttribute("href", "/producto/CL002");
  });

  it("al hacer clic en Agregar llama a alAgregar con el id", async () => {
    const alAgregar = vi.fn();
    renderCard({ alAgregar });
    await userEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(alAgregar).toHaveBeenCalledWith("CL002");
  });

  it("no muestra el botón Agregar si no recibe alAgregar", () => {
    renderCard();
    expect(screen.queryByRole("button", { name: "Agregar" })).not.toBeInTheDocument();
  });

  it("con stock 0 muestra 'Sin stock' y deshabilita Agregar", () => {
    renderCard({ producto: { ...producto, stock: 0 }, alAgregar: () => {} });
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();
  });
});
