/* =========================================================
   productosService.ts — Fuente de datos de productos
   Implementa CRUD completo en memoria.
   ========================================================= */
import type { Producto } from "./paginas/Productos";

export const CATEGORIAS = [
  "Cilindros de Gas",
  "Reguladores",
  "Mangueras y Conexiones",
  "Accesorios",
];

let PRODUCTOS: Producto[] = [
  {
    id: "CL001",
    nombre: "Cilindro GLP 5 kg",
    categoria: "Cilindros de Gas",
    precio: 6500,
    precioComercial: 6000,
    stock: 80,
    imagen: "/img/gasde5k.png",
    descripcionBreve: "Cilindro de gas licuado de petróleo 5 kg. Para uso residencial.",
    descripcionCompleta: "Cilindro de gas licuado de petróleo de 5 kg. Para uso residencial (cocina, calefacción pequeña).",
  },
  {
    id: "CL002",
    nombre: "Cilindro GLP 11 kg",
    categoria: "Cilindros de Gas",
    precio: 12000,
    precioComercial: 11000,
    stock: 200,
    imagen: "/img/gasde11k.png",
    descripcionBreve: "Cilindro estándar doméstico. El más utilizado en hogares chilenos.",
    descripcionCompleta: "Cilindro estándar doméstico. El más utilizado en hogares chilenos.",
  },
  {
    id: "CL003",
    nombre: "Cilindro GLP 15 kg",
    categoria: "Cilindros de Gas",
    precio: 16000,
    precioComercial: 14500,
    stock: 90,
    imagen: "/img/gasde15k.png",
    descripcionBreve: "Cilindro de mayor capacidad para hogares de alto consumo.",
    descripcionCompleta: "Cilindro de mayor capacidad para hogares de alto consumo o locales pequeños.",
  },
  {
    id: "RG001",
    nombre: "Regulador doméstico estándar",
    categoria: "Reguladores",
    precio: 8990,
    precioComercial: 8200,
    stock: 45,
    imagen: "/img/reguladordegasdomestico.png",
    descripcionBreve: "Regulador de 1 etapa para cilindros 5, 11 y 15 kg.",
    descripcionCompleta: "Regulador de 1 etapa para cilindros de 5, 11 y 15 kg. Presión de salida 28 mbar.",
  },
  {
    id: "RG002",
    nombre: "Regulador dual (2 salidas)",
    categoria: "Reguladores",
    precio: 14990,
    precioComercial: 13500,
    stock: 18,
    imagen: "/img/reguladordual.png",
    descripcionBreve: "Permite conectar dos artefactos simultáneamente.",
    descripcionCompleta: "Regulador dual con 2 salidas que permite conectar dos artefactos simultáneamente.",
  },
  {
    id: "MG001",
    nombre: "Manguera gas 1.5 m",
    categoria: "Mangueras y Conexiones",
    precio: 3990,
    precioComercial: 3500,
    stock: 80,
    imagen: "/img/manguerade1,5.png",
    descripcionBreve: "Manguera flexible homologada. Diámetro interior 9mm.",
    descripcionCompleta: "Manguera flexible homologada de 1,5 metros. Diámetro interior 9mm.",
  },
  {
    id: "AC001",
    nombre: "Tapa protectora para válvula",
    categoria: "Accesorios",
    precio: 1490,
    precioComercial: 1200,
    stock: 60,
    imagen: "/img/Tapaprotectoraválvula.png",
    descripcionBreve: "Tapa de plástico ABS para proteger la válvula del cilindro.",
    descripcionCompleta: "Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte.",
  },
];

let contadorId = 100;

/** Devuelve una copia de la lista completa. */
export function obtenerProductos(): Producto[] {
  return PRODUCTOS.map((p) => ({ ...p }));
}

/** Devuelve un producto por id, o undefined si no existe. */
export function obtenerProductoPorId(id: string): Producto | undefined {
  const encontrado = PRODUCTOS.find((p) => p.id === id);
  return encontrado ? { ...encontrado } : undefined;
}

/** Agrega un nuevo producto y devuelve la lista actualizada. */
export function agregarProducto(datos: Omit<Producto, "id">): Producto[] {
  contadorId++;
  const nuevo: Producto = { id: `PROD${contadorId}`, ...datos };
  PRODUCTOS = [...PRODUCTOS, nuevo];
  return obtenerProductos();
}

/** Actualiza un producto existente y devuelve la lista actualizada. */
export function actualizarProducto(id: string, cambios: Partial<Omit<Producto, "id">>): Producto[] {
  PRODUCTOS = PRODUCTOS.map((p) => (p.id === id ? { ...p, ...cambios } : p));
  return obtenerProductos();
}

/** Elimina un producto por id y devuelve la lista actualizada. */
export function eliminarProducto(id: string): Producto[] {
  PRODUCTOS = PRODUCTOS.filter((p) => p.id !== id);
  return obtenerProductos();
}