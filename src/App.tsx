import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import DeletarCliente from "./components/clientes/deletarcliente/DeletarCliente"
import FormCliente from "./components/clientes/formcliente/FormCliente"
import ListaClientes from "./components/clientes/listaclientes/ListaClientes"
import ListaDashboard from "./components/dashboard/listadashboard/ListaDashboard"
import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"
import DeletarOportunidade from "./components/oportunidades/deletaroportunidade/DeletarOportunidade"
import FormOportunidade from "./components/oportunidades/formoportunidade/FormOportunidade"
import ListaOportunidades from "./components/oportunidades/listaoportunidades/Listaoportunidades"
import { AuthProvider } from "./contexts/AuthContext"
import Cadastro from "./pages/cadastro/Cadastro"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Perfil from "./pages/perfil/Perfil"

function App() {


  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <Navbar />
          <div className="min-h-[80vh]">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/Cadastro" element={<Cadastro />} />
              <Route path="/clientes" element={<ListaClientes />} />
              <Route path="/cadastrarcliente" element={<FormCliente />} />
              <Route path="/atualizarcliente/:id" element={<FormCliente />} />
              <Route path="/deletarcliente/:id" element={<DeletarCliente />} />
              <Route path="/oportunidades" element={<ListaOportunidades />} />
              <Route path="/cadastraroportunidade" element={<FormOportunidade />} />
              <Route path="/atualizaroportunidade/:id" element={<FormOportunidade />} />
              <Route path="/deletaroportunidade/:id" element={<DeletarOportunidade />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/dashboard" element={<ListaDashboard />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
