// Formatea un número como precio en pesos chilenos. Ej: 6500 -> "$6.500"
export function formatearPrecio(valor: number): string {
  return "$" + valor.toLocaleString("es-CL");
}
