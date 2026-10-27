// @vitest-environment jsdom
import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../componentes/organismos/Navbar";
import BannerBienvenida from "../componentes/organismos/BannerBienvenida";
import CarritoProvider from "../componentes/moleculas/CarritoProvider";
import { nombreDesdeCorreo } from "../sesion";

afterEach(() => {
    cleanup();
});

const dibujarNavbar = (sesion: { tipo: string; correo: string; nombre: string } | null) =>
    render(
        <MemoryRouter>
            <CarritoProvider>
                <Navbar sesion={sesion} />
            </CarritoProvider>
        </MemoryRouter>
    );

test("SESION-1. Convierte el correo en un nombre para el saludo", () => {
    expect(nombreDesdeCorreo("ana.perez@correo.cl")).toBe("Ana perez");
    expect(nombreDesdeCorreo("@correo.cl")).toBe("Usuario");
});

test("SESION-2. El Navbar saluda y muestra Mi cuenta cuando hay sesión", () => {
    dibujarNavbar({ tipo: "cliente", correo: "ana@correo.cl", nombre: "Ana" });

    expect(screen.getByText("Hola, Ana")).toBeTruthy();
    expect(screen.getByText("Mi cuenta")).toBeTruthy();
    expect(screen.getByText("Mi perfil")).toBeTruthy();
});

test("SESION-3. El Navbar muestra el icono de login y no Mi cuenta sin sesión", () => {
    dibujarNavbar(null);

    expect(screen.getByAltText("Login")).toBeTruthy();
    expect(screen.queryByText("Mi cuenta")).toBeNull();
});

test("SESION-4. Panel admin aparece solo para el administrador", () => {
    dibujarNavbar({ tipo: "cliente", correo: "ana@correo.cl", nombre: "Ana" });
    expect(screen.queryByText("Panel admin")).toBeNull();

    cleanup();
    dibujarNavbar({ tipo: "administrador", correo: "admin@correo.cl", nombre: "Admin" });
    expect(screen.getByText("Panel admin")).toBeTruthy();
});

test("SESION-5. El banner da la bienvenida con el nombre y enlaces rápidos", () => {
    render(
        <MemoryRouter>
            <BannerBienvenida nombre="Ana" />
        </MemoryRouter>
    );

    expect(screen.getByText("¡Bienvenido, Ana!")).toBeTruthy();
    expect(screen.getByText("Ver productos").getAttribute("href")).toBe("/productos");
    expect(screen.getByText("Mi carrito").getAttribute("href")).toBe("/carrito");
});