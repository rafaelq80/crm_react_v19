import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const { usuario, isLogout } = useContext(AuthContext);
  const token = usuario.token;

  useEffect(() => {
    if (token === "") {
      if (!isLogout) {
        ToastAlerta("Você precisa estar logado!", "info");
      }
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 flex justify-center items-center overflow-hidden relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 lg:px-12 py-12 relative z-10">
        {/* Coluna de Texto */}
        <div className="flex flex-col gap-6 items-center lg:items-start justify-center py-8 lg:py-4 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-zinc-900 text-5xl lg:text-6xl font-bold leading-tight animate-slide-in-left">
              Seja Bem-vinde!
            </h2>
            
            <div className="h-1 w-24 bg-linear-to-r from-zinc-600 to-zinc-400 rounded-full animate-slide-in-left delay-200"></div>
            
            <p className="text-zinc-700 text-xl lg:text-2xl leading-relaxed animate-slide-in-left delay-300">
              Conecte, Simplifique, Cresça!
            </p>
            
            <p className="text-zinc-600 text-lg animate-slide-in-left delay-400">
              Tudo o que você precisa em um único CRM.
            </p>
          </div>

          {/* Cards de recursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full max-w-2xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-500">
              <div className="w-12 h-12 bg-zinc-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-zinc-900 font-bold text-lg mb-2">Gestão de Clientes</h3>
              <p className="text-zinc-600 text-sm">Organize e acompanhe seus clientes de forma eficiente</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-600">
              <div className="w-12 h-12 bg-zinc-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-zinc-900 font-bold text-lg mb-2">Oportunidades</h3>
              <p className="text-zinc-600 text-sm">Gerencie seu funil de vendas e feche mais negócios</p>
            </div>
          </div>
        </div>

        {/* Coluna de Imagem */}
        <div className="flex justify-center items-center lg:justify-end animate-fade-in-right">
          <div className="relative">
            {/* Efeito de brilho atrás da imagem */}
            <div className="absolute inset-0 bg-linear-to-r from-zinc-400 to-zinc-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            
            <img
              src="https://ik.imagekit.io/vzr6ryejm/crm/home_02.png?updatedAt=1729405554760"
              alt="Imagem Página Home"
              className="relative w-full max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

export default Home;