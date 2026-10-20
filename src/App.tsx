import { Routes, Route } from 'react-router-dom'
import Navbar from './componentes/organismos/Navbar'
import Inicio from './paginas/Inicio'

// 1. Estilos base de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"

// 2. Estilos personalizados (sobreescriben Bootstrap)
import './index.css'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
      </Routes>
    </>
  )
}

export default App
