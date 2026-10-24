// @vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Contacto from "../paginas/Contacto";

test("El contenedor de Contacto posee las clases de columna de Bootstrap", () => {
    render(<Contacto />);

    const contenedor = screen.getByTestId("contenedor-grid");

    expect(contenedor.className).toContain("col-md-6");
});