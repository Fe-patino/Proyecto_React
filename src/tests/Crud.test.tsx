// @vitest-environment jsdom
import { test, expect, beforeEach } from "vitest";
import {
    obtenerProductos,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
} from "../productosService";

// Guarda la cantidad inicial para comparar
let cantidadInicial: number;

beforeEach(() => {
    cantidadInicial = obtenerProductos().length;
});

// ── LEER ──
test("CRUD-1: obtenerProductos devuelve una lista con productos", () => {
    const lista = obtenerProductos();
    expect(lista.length).toBeGreaterThan(0);
});

test("CRUD-2: obtenerProductos devuelve copias, no referencias directas", () => {
    const lista = obtenerProductos();
    lista[0].nombre = "MODIFICADO";
    const lista2 = obtenerProductos();
    expect(lista2[0].nombre).not.toBe("MODIFICADO");
});

// ── CREAR ──
test("CRUD-3: agregarProducto aumenta la lista en 1", () => {
    agregarProducto({
        nombre: "Producto de prueba",
        categoria: "Accesorios",
        precio: 1000,
        precioComercial: 900,
        stock: 10,
        imagen: "/img/test.png",
        descripcionBreve: "Prueba",
        descripcionCompleta: "Prueba completa",
    });
    expect(obtenerProductos().length).toBe(cantidadInicial + 1);
});

test("CRUD-4: el producto creado aparece en la lista con los datos correctos", () => {
    const lista = agregarProducto({
        nombre: "Gas especial test",
        categoria: "Cilindros de Gas",
        precio: 9999,
        precioComercial: 8000,
        stock: 5,
        imagen: "/img/test.png",
        descripcionBreve: "Test breve",
        descripcionCompleta: "Test completo",
    });
    const nuevo = lista.find((p) => p.nombre === "Gas especial test");
    expect(nuevo).toBeDefined();
    expect(nuevo?.precio).toBe(9999);
});

// ── ACTUALIZAR ──
test("CRUD-5: actualizarProducto modifica el nombre del producto", () => {
    const antes = obtenerProductos()[0];
    actualizarProducto(antes.id, { nombre: "Nombre actualizado" });
    const despues = obtenerProductos().find((p) => p.id === antes.id);
    expect(despues?.nombre).toBe("Nombre actualizado");
});

test("CRUD-6: actualizarProducto modifica el precio correctamente", () => {
    const antes = obtenerProductos()[0];
    actualizarProducto(antes.id, { precio: 99999 });
    const despues = obtenerProductos().find((p) => p.id === antes.id);
    expect(despues?.precio).toBe(99999);
});

// ── ELIMINAR ──
test("CRUD-7: eliminarProducto reduce la lista en 1", () => {
    const lista = obtenerProductos();
    eliminarProducto(lista[0].id);
    expect(obtenerProductos().length).toBe(lista.length - 1);
});

test("CRUD-8: el producto eliminado ya no aparece en la lista", () => {
    const lista = obtenerProductos();
    const idEliminar = lista[0].id;
    eliminarProducto(idEliminar);
    const despues = obtenerProductos().find((p) => p.id === idEliminar);
    expect(despues).toBeUndefined();
});