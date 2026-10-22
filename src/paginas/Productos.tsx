import CatalogoProductos from "../componentes/organismos/CatalogoProductos"

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  precioComercial: number;
  stock: number;
  imagen: string;
  descripcionBreve: string;
  descripcionCompleta: string;
}

// Página /productos
function Productos() {
    return (
        <div className="container my-5">
            <h1>Catálogo de cilindros &amp; accesorios</h1>
            <p className="text-muted mb-4">Elige el formato que necesitas y agrégalo a tu carrito</p>
            <CatalogoProductos />
        </div>
    )
}
export default Productos
