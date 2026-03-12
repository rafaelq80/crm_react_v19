import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { createColumnHelper } from "@tanstack/react-table";
import type Cliente from "../../../models/Cliente";
import type { NavigateFunction } from "react-router-dom";

const columnHelper = createColumnHelper<Cliente>();

export function createClienteColumns(navigate: NavigateFunction) {

  return [
    columnHelper.accessor("foto", {
      header: "Logo",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <div className="w-16 h-16 p-1 relative">
            <img
              src={url}
              alt="Logo do cliente"
              className="w-full h-full object-cover rounded-full shadow-sm"
              onError={(e) => {
                e.currentTarget.src =
                  "https://ik.imagekit.io/vzr6ryejm/profile/usuario.svg?updatedAt=1729485119852";
              }}
            />
          </div>
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-gray-500 text-xs font-semibold">N/A</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("nome", {
      header: "Nome",
      cell: (info) => (
        <span className="font-medium text-gray-800">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <span className="text-gray-600">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("historico", {
      header: "Histórico",
      cell: (info) => (
        <span className="text-gray-600">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Ações",
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={() => navigate(`/atualizarcliente/${id}`)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
              aria-label="Editar cliente"
            >
              <PencilIcon 
                size={20} 
                className="text-blue-500 group-hover:text-blue-700 transition-colors" 
              />
            </button>

            <button 
              onClick={() => navigate(`/deletarcliente/${id}`)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
              aria-label="Excluir cliente"
            >
              <TrashIcon 
                size={20} 
                className="text-red-500 group-hover:text-red-700 transition-colors" 
              />
            </button>
          </div>
        );
      },
    }),
  ];
}