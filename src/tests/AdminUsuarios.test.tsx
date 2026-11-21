// @vitest-environment jsdom
import { test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Administrador from "../paginas/Administrador";
import { guardarSesionLocal } from "../sesion";
import type { Usuario } from "../usuariosService";

const USUARIOS: Usuario[] = [
  { id: 1, nombre: "Admin", correo: "admin@gasvolcan.cl", rol: "ADMINISTRADOR" },
  { id: 2, nombre: "Ana Pérez", correo: "ana@correo.cl", rol: "CLIENTE" },
];

// Simula ms-autenticacion (usuarios) y deja el resto de los microservicios vacíos
function simularBackend(opciones: { correoDuplicado?: boolean } = {}) {
  let lista = USUARIOS.map((u) => ({ ...u }));
  const llamadas: { url: string; metodo: string; headers: Record<string, string>; cuerpo?: string }[] = [];
  const respuesta = (cuerpo: unknown, ok = true, status = 200) =>
    ({ ok, status, json: async () => cuerpo }) as Response;

  const fetchFalso = vi.fn(async (url: string, op: RequestInit = {}) => {
    const metodo = op.method ?? "GET";
    llamadas.push({ url, metodo, headers: (op.headers ?? {}) as Record<string, string>, cuerpo: op.body as string | undefined });

    if (url.includes(":8082/api/auth/usuarios")) {
      if (metodo === "POST") {
        if (opciones.correoDuplicado) return respuesta({}, false, 409);
        const nuevo = { id: 99, ...JSON.parse(String(op.body)) } as Usuario;
        lista = [...lista, nuevo];
        return respuesta(nuevo, true, 201);
      }
      if (metodo === "DELETE") {
        const id = Number(url.split("/").pop());
        lista = lista.filter((u) => u.id !== id);
        return respuesta({}, true, 204);
      }
      return respuesta(lista);
    }
    return respuesta([]);
  });
  vi.stubGlobal("fetch", fetchFalso);
  return llamadas;
}

function abrirVistaUsuarios() {
  render(
    <MemoryRouter>
      <Administrador alCerrarSesion={() => {}} />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: /^usuarios$/i }));
}

function llenarFormulario(nombre: string, correo: string, password: string, rol?: string) {
  fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: nombre } });
  fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: password } });
  if (rol) fireEvent.change(screen.getByLabelText(/tipo de usuario/i), { target: { value: rol } });
}

beforeEach(() => {
  guardarSesionLocal({ tipo: "administrador", correo: "admin@gasvolcan.cl", nombre: "Admin", token: "TOKEN_ADMIN" });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  guardarSesionLocal(null);
});

test("USR-1. La vista Usuarios lista los usuarios con su tipo y pide los datos con el token", async () => {
  const llamadas = simularBackend();
  abrirVistaUsuarios();

  const tabla = await screen.findByTestId("tabla-usuarios");
  await waitFor(() => expect(within(tabla).getByText("Ana Pérez")).toBeTruthy());
  expect(within(tabla).getByText("Cliente")).toBeTruthy();
  expect(within(tabla).getByText("Administrador")).toBeTruthy();

  const get = llamadas.find((l) => l.url.includes(":8082/api/auth/usuarios") && l.metodo === "GET");
  expect(get?.headers.Authorization).toBe("Bearer TOKEN_ADMIN");
});

test("USR-2. Se puede crear un usuario administrador y se envía el rol elegido", async () => {
  const llamadas = simularBackend();
  abrirVistaUsuarios();
  await screen.findByTestId("tabla-usuarios");

  llenarFormulario("Pedro Soto", "pedro@correo.cl", "clave123", "ADMINISTRADOR");
  fireEvent.click(screen.getByRole("button", { name: /crear usuario/i }));

  await waitFor(() => expect(within(screen.getByTestId("tabla-usuarios")).getByText("Pedro Soto")).toBeTruthy());

  const post = llamadas.find((l) => l.metodo === "POST");
  expect(post?.headers.Authorization).toBe("Bearer TOKEN_ADMIN");
  expect(JSON.parse(post!.cuerpo!)).toEqual({
    nombre: "Pedro Soto",
    correo: "pedro@correo.cl",
    password: "clave123",
    rol: "ADMINISTRADOR",
  });
});

test("USR-3. No envía el formulario si la contraseña no cumple la longitud", async () => {
  const llamadas = simularBackend();
  abrirVistaUsuarios();
  await screen.findByTestId("tabla-usuarios");

  llenarFormulario("Pedro Soto", "pedro@correo.cl", "123");
  fireEvent.click(screen.getByRole("button", { name: /crear usuario/i }));

  expect(screen.getByText("La contraseña debe tener entre 4 y 20 caracteres")).toBeTruthy();
  expect(llamadas.some((l) => l.metodo === "POST")).toBe(false);
});

test("USR-4. Muestra un aviso si el correo ya está registrado", async () => {
  simularBackend({ correoDuplicado: true });
  abrirVistaUsuarios();
  await screen.findByTestId("tabla-usuarios");

  llenarFormulario("Ana Repetida", "ana@correo.cl", "clave123");
  fireEvent.click(screen.getByRole("button", { name: /crear usuario/i }));

  expect(await screen.findByText("El correo ya está registrado.")).toBeTruthy();
});

test("USR-5. Se puede eliminar otro usuario, pero no la cuenta propia", async () => {
  const llamadas = simularBackend();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  abrirVistaUsuarios();

  const tabla = await screen.findByTestId("tabla-usuarios");
  await waitFor(() => expect(within(tabla).getByText("Ana Pérez")).toBeTruthy());

  // Solo hay un botón Eliminar: el de Ana. La cuenta del administrador logueado muestra "Tu cuenta"
  expect(within(tabla).getAllByRole("button", { name: /eliminar/i })).toHaveLength(1);
  expect(within(tabla).getByText("Tu cuenta")).toBeTruthy();

  fireEvent.click(within(tabla).getByRole("button", { name: /eliminar/i }));

  await waitFor(() => expect(within(screen.getByTestId("tabla-usuarios")).queryByText("Ana Pérez")).toBeNull());
  const borrado = llamadas.find((l) => l.metodo === "DELETE");
  expect(borrado?.url).toBe("http://localhost:8082/api/auth/usuarios/2");
  expect(borrado?.headers.Authorization).toBe("Bearer TOKEN_ADMIN");
});
