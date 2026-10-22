import Input from "../atomos/Input"

interface BuscadorProductosProps {
    valor: string;
    alCambiar: (valor: string) => void;
}

// Molécula: campo de búsqueda con etiqueta accesible (oculta visualmente)
function BuscadorProductos({ valor, alCambiar }: BuscadorProductosProps) {
    return (
        <div>
            <label htmlFor="buscador-productos" className="visually-hidden">Buscar producto</label>
            <Input id="buscador-productos" tipo="search" valor={valor} alCambiar={alCambiar} placeholder="Buscar producto..." />
        </div>
    )
}
export default BuscadorProductos
