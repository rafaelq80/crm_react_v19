import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";

function Perfil() {
  const navigate = useNavigate();

  const { usuario, isLogout } = useContext(AuthContext);

  useEffect(() => {
    if (usuario.token === "") {
      if (!isLogout) {
        ToastAlerta("Você precisa estar logado!", "info");
      }
      navigate("/");
    }
  }, [usuario.token]);

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="w-full max-w-8xl mx-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Imagem de Capa */}
          <div className="relative h-80 overflow-hidden">
            <img
              className="w-full h-full object-cover object-center"
              src="https://ik.imagekit.io/vzr6ryejm/crm/bg_01.jpeg?updatedAt=1729453854851"
              alt="Capa do Perfil"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Foto de Perfil */}
          <div className="relative px-8">
            <div className="flex justify-center">
              <div className="relative -mt-24">
                <img
                  className="w-48 h-48 rounded-full border-8 border-white shadow-2xl object-cover"
                  src={usuario.foto}
                  alt={`Foto de perfil de ${usuario.nome}`}
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
            </div>

            {/* Informações do Usuário */}
            <div className="text-center mt-6 pb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {usuario.nome}
              </h1>
              <p className="text-lg text-gray-600 mb-8">{usuario.usuario}</p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;