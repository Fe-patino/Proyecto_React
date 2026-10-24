// @vitest-environment jsdom
import { test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../paginas/Login"; // Ajusta la ruta si tu archivo está en otra carpeta

afterEach(() => {
    cleanup();
});

test("1. Muestra una alerta si se intenta iniciar sesión con el correo vacío", () => {
    const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});
    const funcionAlIngresar = vi.fn();

    render(
        <MemoryRouter>
            <Login alIngresar={funcionAlIngresar} />
        </MemoryRouter>
    );

    const botonSiguiente = screen.getByRole("button", { name: /siguiente/i });
    fireEvent.click(botonSiguiente);

    expect(alerta).toHaveBeenCalledWith("Debe ingresar su correo");
    alerta.mockRestore();
});

test("2. Muestra alerta si la contraseña no cumple la longitud requerida (4 a 10 caracteres)", () => {
    const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
        <MemoryRouter>
            <Login alIngresar={vi.fn()} />
        </MemoryRouter>
    );

    const campoCorreo = screen.getByLabelText(/email/i);
    const campoContrasena = screen.getByLabelText(/contraseña/i);

    fireEvent.change(campoCorreo, { target: { value: "cliente@gaselvolcan.cl" } });
    fireEvent.change(campoContrasena, { target: { value: "123" } }); // 3 caracteres (inválido)

    const botonSiguiente = screen.getByRole("button", { name: /siguiente/i });
    fireEvent.click(botonSiguiente);

    expect(alerta).toHaveBeenCalledWith("La contraseña debe tener entre 4 y 10 caracteres");
    alerta.mockRestore();
});

test("3. Cambia al modo 'Crear cuenta' al hacer clic en '¿No estás registrado?'", () => {
    render(
        <MemoryRouter>
            <Login alIngresar={vi.fn()} />
        </MemoryRouter>
    );

    const botonRegistro = screen.getByRole("button", { name: /¿no estás registrado\?/i });
    fireEvent.click(botonRegistro);

  // Verificaciones con TypeScript nativo (sin rojo):
    expect(screen.getByRole("heading", { name: /crear cuenta/i })).toBeTruthy();
    expect(screen.getByLabelText(/nombre completo/i)).toBeTruthy();
});

test("4. Inicia sesión correctamente con datos válidos", () => {
    const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});
    const funcionAlIngresar = vi.fn();

    render(
        <MemoryRouter>
            <Login alIngresar={funcionAlIngresar} />
        </MemoryRouter>
    );

    const campoCorreo = screen.getByLabelText(/email/i);
    const campoContrasena = screen.getByLabelText(/contraseña/i);

    fireEvent.change(campoCorreo, { target: { value: "usuario@ejemplo.com" } });
    fireEvent.change(campoContrasena, { target: { value: "123456" } });

    const botonSiguiente = screen.getByRole("button", { name: /siguiente/i });
    fireEvent.click(botonSiguiente);

    expect(alerta).toHaveBeenCalledWith("Datos ingresados correctamente");
    expect(funcionAlIngresar).toHaveBeenCalledWith("cliente");

    alerta.mockRestore();
});