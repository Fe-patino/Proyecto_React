// Se ejecuta antes de cada archivo de pruebas
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Desmonta los componentes tras cada prueba para que sean independientes
afterEach(() => cleanup());
