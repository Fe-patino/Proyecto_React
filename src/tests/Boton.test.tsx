import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Boton from "../componentes/atomos/Boton";

describe("Boton (Ver Producto)", () => {
  it("es un enlace a /producto/:id con el código recibido", () => {
    render(
      <MemoryRouter>
        <Boton id="CL002" />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Ver Producto" })).toHaveAttribute("href", "/producto/CL002");
  });
});
