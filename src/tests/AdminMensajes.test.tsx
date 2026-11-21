// @vitest-environment jsdom
import { test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Administrador from "../paginas/Administrador";
import {
  contarPendientes,
  ordenarMasNuevosPrimero,
  type MensajeContacto,
} from "../contactoService";

const MENSAJES: MensajeContacto[] = [
  { id: 1, nombreCompleto: "Ana Pérez", correo: "ana@correo.cl", mensaje: "¿Reparten en Bulnes?", estado: "PENDIENTE", fechaCreacion: "2026-11-18T10:00:00" },
  { id: 2, nombreCompleto: "Luis Soto", correo: "luis@correo.cl", mensaje: "Gracias por la atención", estado: "RESPONDIDO", fechaCreacion: "2026-11-19T09:00:00" },
  { id: 3, nombreCompleto: "Marta Rojas", correo: "marta@correo.cl", mensaje: "Necesito un cilindro de 15 kg", estado: "PENDIENTE", fechaCreacion: "2026-11-20T08:30:00" },
];

// Simula los microservicios: productos vacío, pagos vacío y contacto con MENSAJES
function simularBackend(mensajes: MensajeContacto[] = MENSAJES) {
  const lista = mensajes.map((m) => ({ ...m }));
  const fetchFalso = vi.fn(async (url: string, opciones?: RequestInit) => {
    const respuesta = (cuerpo: unknown, ok = true) => ({ ok, json: async () => cuerpo }) as Response;
    if (url.includes(":8083/api/contactos") && opciones?.method === "PUT") {
      const id = Number(url.split("/contactos/")[1].split("/")[0]);
      const estado = new URL(url).searchParams.get("estado") as MensajeContacto["estado"];
      const m = lista.find((x) => x.id === id)!;
      m.estado = estado;
      return respuesta(m);
    }
    if (url.includes(":8083/api/contactos")) return respuesta(lista);
    return respuesta([]);
  });
  vi.stubGlobal("fetch", fetchFalso);
  return fetchFalso;
}

function abrirAdmin() {
  render(
    <MemoryRouter>
      <Administrador alCerrarSesion={() => {}} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  simularBackend();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("MSG-1. contarPendientes cuenta solo los mensajes pendientes", () => {
  expect(contarPendientes(MENSAJES)).toBe(2);
  expect(contarPendientes([])).toBe(0);
});

test("MSG-2. ordenarMasNuevosPrimero ordena por fecha descendente sin modificar la lista original", () => {
  const ordenados = ordenarMasNuevosPrimero(MENSAJES);
  expect(ordenados.map((m) => m.id)).toEqual([3, 2, 1]);
  expect(MENSAJES.map((m) => m.id)).toEqual([1, 2, 3]);
});

test("MSG-3. El menú del Admin muestra cuántos mensajes están pendientes", async () => {
  abrirAdmin();
  expect(await screen.findByTestId("contador-mensajes")).toHaveTextContent("2");
});

test("MSG-4. La vista Mensajes lista los mensajes de los clientes, el más nuevo primero", async () => {
  abrirAdmin();
  fireEvent.click(await screen.findByRole("button", { name: /Mensajes/ }));

  const tabla = await screen.findByTestId("tabla-mensajes");
  const filas = within(tabla).getAllByRole("row");
  expect(filas).toHaveLength(3);
  expect(filas[0]).toHaveTextContent("Marta Rojas");
  expect(filas[0]).toHaveTextContent("Necesito un cilindro de 15 kg");
  expect(filas[2]).toHaveTextContent("Ana Pérez");
});

test("MSG-5. El filtro Pendientes oculta los mensajes ya respondidos", async () => {
  abrirAdmin();
  fireEvent.click(await screen.findByRole("button", { name: /Mensajes/ }));
  await screen.findByTestId("tabla-mensajes");

  fireEvent.click(screen.getByRole("button", { name: "Pendientes" }));

  const tabla = screen.getByTestId("tabla-mensajes");
  expect(within(tabla).getAllByRole("row")).toHaveLength(2);
  expect(tabla).not.toHaveTextContent("Luis Soto");
});

test("MSG-6. Marcar un mensaje como respondido actualiza su estado y el contador", async () => {
  const fetchFalso = simularBackend();
  abrirAdmin();
  fireEvent.click(await screen.findByRole("button", { name: /Mensajes/ }));
  const tabla = await screen.findByTestId("tabla-mensajes");

  const fila = within(tabla).getByText("Ana Pérez").closest("tr")!;
  fireEvent.click(within(fila).getByRole("button", { name: "Marcar respondido" }));

  await waitFor(() => expect(screen.getByTestId("contador-mensajes")).toHaveTextContent("1"));
  expect(fetchFalso).toHaveBeenCalledWith(
    "http://localhost:8083/api/contactos/1/estado?estado=RESPONDIDO",
    expect.objectContaining({ method: "PUT" }),
  );
});

test("MSG-7. Si ms-contacto no responde se muestra un aviso en vez de una tabla vacía", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, json: async () => [] }) as Response));
  abrirAdmin();
  fireEvent.click(await screen.findByRole("button", { name: /Mensajes/ }));

  expect(await screen.findByText(/No se pudieron cargar los mensajes/)).toBeInTheDocument();
});
