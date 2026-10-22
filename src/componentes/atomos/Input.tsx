interface InputProps {
    id: string;
    valor: string;
    alCambiar: (valor: string) => void;
    tipo?: string;
    placeholder?: string;
}

// Átomo: input controlado. El estado vive en quien lo usa (valor + alCambiar).
function Input({ id, valor, alCambiar, tipo = "text", placeholder }: InputProps) {
    return (
        <input
            id={id}
            type={tipo}
            className="form-control"
            value={valor}
            placeholder={placeholder}
            onChange={(e) => alCambiar(e.target.value)}
        />
    )
}
export default Input
