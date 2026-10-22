interface FiltroCategoriasProps {
    categorias: string[];
    activa: string;
    alSeleccionar: (categoria: string) => void;
}

// Molécula: botones de filtro por categoría ("Todos" + cada categoría)
function FiltroCategorias({ categorias, activa, alSeleccionar }: FiltroCategoriasProps) {
    return (
        <div className="d-flex gap-2 flex-wrap" role="group" aria-label="Filtrar por categoría">
            {["Todos", ...categorias].map((categoria) => (
                <button
                    key={categoria}
                    type="button"
                    className={`btn btn-sm ${categoria === activa ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => alSeleccionar(categoria)}
                >
                    {categoria}
                </button>
            ))}
        </div>
    )
}
export default FiltroCategorias
