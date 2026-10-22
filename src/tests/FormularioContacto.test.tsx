// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FormularioContacto from "../componentes/organismos/FormularioContacto";

test("1. Muestra una alerta cuando el nombre está vacío", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<FormularioContacto />);

  const botonEnviar = screen.getByText(/enviar/i);
  fireEvent.click(botonEnviar);

  expect(alerta).toHaveBeenCalledWith("Debe ingresar su nombre");
  alerta.mockRestore();
});

test("2. Muestra una alerta cuando el correo está vacío", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<FormularioContacto />);

  const campoNombre = screen.getByLabelText(/nombre/i);
  fireEvent.change(campoNombre, { target: { value: "Juan Pérez" } });

  const botonEnviar = screen.getByText(/enviar/i);
  fireEvent.click(botonEnviar);

  expect(alerta).toHaveBeenCalledWith("Debe ingresar su correo");
  alerta.mockRestore();
});

test("3. Muestra una alerta cuando el correo no tiene un formato válido", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<FormularioContacto />);

  const campoNombre = screen.getByLabelText(/nombre/i);
  const campoCorreo = screen.getByLabelText(/correo/i);

  fireEvent.change(campoNombre, { target: { value: "Juan Pérez" } });
  fireEvent.change(campoCorreo, { target: { value: "correo_invalido.com" } });

  const botonEnviar = screen.getByText(/enviar/i);
  fireEvent.click(botonEnviar);

  expect(alerta).toHaveBeenCalledWith("Ingrese un correo válido");
  alerta.mockRestore();
});

test("4. Muestra una alerta cuando el mensaje está vacío", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<FormularioContacto />);

  const campoNombre = screen.getByLabelText(/nombre/i);
  const campoCorreo = screen.getByLabelText(/correo/i);

  fireEvent.change(campoNombre, { target: { value: "Juan Pérez" } });
  fireEvent.change(campoCorreo, { target: { value: "juan@example.com" } });

  const botonEnviar = screen.getByText(/enviar/i);
  fireEvent.click(botonEnviar);

  expect(alerta).toHaveBeenCalledWith("Debe ingresar un mensaje");
  alerta.mockRestore();
});

test("5. Muestra alerta de éxito y limpia el formulario cuando los datos son válidos", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<FormularioContacto />);

  const campoNombre = screen.getByLabelText(/nombre/i) as HTMLInputElement;
  const campoCorreo = screen.getByLabelText(/correo/i) as HTMLInputElement;
  const campoMensaje = screen.getByLabelText(/mensaje/i) as HTMLTextAreaElement;

  fireEvent.change(campoNombre, { target: { value: "Juan Pérez" } });
  fireEvent.change(campoCorreo, { target: { value: "juan@example.com" } });
  fireEvent.change(campoMensaje, { target: { value: "Hola, solicito información sobre balones de gas" } });

  const botonEnviar = screen.getByText(/enviar/i);
  fireEvent.click(botonEnviar);

  expect(alerta).toHaveBeenCalledWith(
    expect.stringContaining("¡Formulario enviado correctamente!")
  );

  expect(campoNombre.value).toBe("");
  expect(campoCorreo.value).toBe("");
  expect(campoMensaje.value).toBe("");

  alerta.mockRestore();
});