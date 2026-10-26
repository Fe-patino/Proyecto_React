// @vitest-environment jsdom
import { describe, test, expect } from "vitest";
import { filtrarProductos } from "../componentes/moleculas/FiltroProductos";
import { obtenerProductos } from "../productosService";
import type { Producto } from "../paginas/Productos";

// Lista pequeña y controlada para probar el filtro sin depender de los datos reales
const base = {
    precio: 1000,
    precioComercial: 900,
    stock: 10,
    imagen: "/img/test.png",
    descripcionCompleta: "Descripción completa",
};

const lista: Producto[] = [
    { ...base, id: "CL001", nombre: "Cilindro GLP 5 kg", categoria: "Cilindros de Gas", descripcionBreve: "Uso residencial" },
    { ...base, id: "CL002", nombre: "Cilindro GLP 11 kg", categoria: "Cilindros de Gas", descripcionBreve: "Uso doméstico y comercial" },
    { ...base, id: "RG001", nombre: "Regulador de gas", categoria: "Reguladores", descripcionBreve: "Controla la presión" },
    { ...base, id: "AC001", nombre: "Kit de conexión completo", categoria: "Accesorios", descripcionBreve: "Incluye manguera" },
];

describe("filtrarProductos", () => {
    test("FILTRO-1: con categoría Todos y sin texto devuelve todos los productos", () => {
        const resultado = filtrarProductos(lista, { categoria: "Todos", texto: "" });
        expect(resultado).toHaveLength(4);
    });

    test("FILTRO-2: filtra por categoría y devuelve solo los de esa categoría", () => {
        const resultado = filtrarProductos(lista, { categoria: "Cilindros de Gas", texto: "" });
        expect(resultado).toHaveLength(2);
        expect(resultado.every((p) => p.categoria === "Cilindros de Gas")).toBe(true);
    });

    test("FILTRO-3: filtra por texto en el nombre del producto", () => {
        const resultado = filtrarProductos(lista, { categoria: "Todos", texto: "regulador" });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id).toBe("RG001");
    });

    test("FILTRO-4: la búsqueda ignora mayúsculas y minúsculas", () => {
        const resultado = filtrarProductos(lista, { categoria: "Todos", texto: "CILINDRO" });
        expect(resultado).toHaveLength(2);
    });

    test("FILTRO-5: la búsqueda ignora las tildes (domestico encuentra doméstico)", () => {
        const resultado = filtrarProductos(lista, { categoria: "Todos", texto: "domestico" });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id).toBe("CL002");
    });

    test("FILTRO-6: busca también por el id del producto", () => {
        const resultado = filtrarProductos(lista, { categoria: "Todos", texto: "ac001" });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].nombre).toBe("Kit de conexión completo");
    });

    test("FILTRO-7: busca también en la descripción breve", () => {
        const resultado = filtrarProductos(lista, { categoria: "Todos", texto: "manguera" });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id).toBe("AC001");
    });

    test("FILTRO-8: combina categoría y texto (deben cumplirse las dos)", () => {
        const resultado = filtrarProductos(lista, { categoria: "Cilindros de Gas", texto: "11 kg" });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id).toBe("CL002");
    });

    test("FILTRO-9: devuelve una lista vacía cuando nada coincide", () => {
        const resultado = filtrarProductos(lista, { categoria: "Todos", texto: "producto inexistente" });
        expect(resultado).toEqual([]);
    });

    test("FILTRO-10: no modifica la lista original", () => {
        filtrarProductos(lista, { categoria: "Reguladores", texto: "" });
        expect(lista).toHaveLength(4);
    });

    test("FILTRO-11: funciona con los productos reales del servicio de datos", () => {
        const reales = obtenerProductos();
        const resultado = filtrarProductos(reales, { categoria: "Todos", texto: "5 kg" });
        expect(resultado.length).toBeGreaterThan(0);
        expect(resultado.some((p) => p.nombre === "Cilindro GLP 5 kg")).toBe(true);
    });
});