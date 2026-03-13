import { SignOut } from "@phosphor-icons/react";
import { type ReactNode, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { usuario, handleLogout } = useContext(AuthContext);

  function logout() {
    handleLogout();
    ToastAlerta("Usuário desconectado!", "info");
    navigate("/");
  }

  // Função para verificar se a rota está ativa
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  let component: ReactNode;

  if (usuario.token !== "") {
    component = (
      <nav className="sticky top-0 z-50 bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 shadow-xl border-b border-zinc-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/home" 
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              <img
                src="https://ik.imagekit.io/vzr6ryejm/crm/logo_crm.png?updatedAt=1729365177919"
                alt="Logo"
                className="w-36 drop-shadow-lg"
              />
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link 
                to="/clientes" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/clientes')
                    ? 'bg-zinc-700 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-zinc-700/50'
                }`}
              >
                Clientes
              </Link>
              
              <Link 
                to="/oportunidades" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/oportunidades')
                    ? 'bg-zinc-700 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-zinc-700/50'
                }`}
              >
                Oportunidades
              </Link>
              
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/dashboard')
                    ? 'bg-zinc-700 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-zinc-700/50'
                }`}
              >
                Dashboard
              </Link>

              {/* Divider */}
              <div className="h-8 w-px bg-zinc-600 mx-2"></div>

              {/* Profile */}
              <Link 
                to="/Perfil" 
                className="group relative"
              >
                <div className="relative">
                  <img
                    src={usuario.foto}
                    alt={usuario.nome}
                    className="w-10 h-10 rounded-full border-2 border-zinc-600 
                      group-hover:border-zinc-400 transition-all duration-300 
                      shadow-lg object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-zinc-700 opacity-0 
                    group-hover:opacity-20 transition-opacity duration-300">
                  </div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  pointer-events-none">
                  <div className="bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-lg 
                    shadow-xl border border-zinc-700 whitespace-nowrap">
                    {usuario.nome}
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="group flex items-center justify-center w-10 h-10 rounded-lg 
                  text-gray-300 hover:text-white hover:bg-red-600/20 
                  transition-all duration-300 relative"
                aria-label="Sair"
              >
                <SignOut size={24} weight="bold" className="transition-transform duration-300 group-hover:scale-110" />
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  pointer-events-none">
                  <div className="bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-lg 
                    shadow-xl border border-zinc-700 whitespace-nowrap">
                    Sair
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {component}
    </>
  )
}

export default Navbar;