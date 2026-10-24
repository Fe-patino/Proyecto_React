// @vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Boton from "../componentes/atomos/Boton";

test("El botón muestra el texto 'Ver Producto' y redirige a la ruta correcta", () => {
  render(
    <MemoryRouter>
      <Boton id="1" />
    </MemoryRouter>
  );

  const enlace = screen.getByRole("link", { name: /ver producto/i });

  // Verificación 1: Que el texto sea correcto
  expect(enlace.textContent).toBe("Ver Producto");

  // Verificación 2: Que apunte a la ruta esperada del producto
  expect(enlace.getAttribute("href")).toBe("/producto/1");
});