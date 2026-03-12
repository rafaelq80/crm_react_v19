import { ArrowsClockwiseIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { createColumnHelper } from "@tanstack/react-table";
import type Oportunidade from "../../../models/Oportunidade";
import { useNavigate } from "react-router-dom";
import { formatarData } from "../../../utils/FormatarData";
import { formatarMoeda } from "../../../utils/FormatarMoeda";

const columnHelper = createColumnHelper<Oportunidade>();

interface CreateOportunidadeColumnsProps {
  onStatus: (oportunidade: Oportunidade) => void;
}

export function createOportunidadeColumns({
  onStatus,
}: CreateOportunidadeColumnsProps) {
  const navigate = useNavigate();

  return [
    columnHelper.accessor("descricao", {
      header: "Oportunidade",
      cell: (info) => (
        <span className="font-medium text-gray-800">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("valor", {
      header: "Valor",
      cell: (info) => {
        const valor = info.getValue();
        return (
          <span className="font-semibold text-green-600">
            {formatarMoeda(valor)}
          </span>
        );
      },
    }),
    columnHelper.accessor("dataFechamento", {
      header: "Término",
      cell: (info) => {
        const data = info.getValue();
        return (
          <span className="text-gray-600">
            {data ? formatarData(data) : "-"}
          </span>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const statusConfig = {
          1: {
            label: "Aberta",
            classes: "bg-yellow-100 text-yellow-800 border-yellow-300",
          },
          2: {
            label: "Fechada",
            classes: "bg-green-100 text-green-800 border-green-300",
          },
          3: {
            label: "Perdida",
            classes: "bg-red-100 text-red-800 border-red-300",
          },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
          label: "Desconhecida",
          classes: "bg-gray-100 text-gray-800 border-gray-300",
        };

        return (
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full 
              text-xs font-bold border-2 ${config.classes}`}
          >
            {config.label}
          </span>
        );
      },
    }),
    columnHelper.accessor("cliente.nome", {
      header: "Cliente",
      cell: (info) => (
        <span className="text-gray-700">{info.getValue() || "-"}</span>
      ),
    }),
    columnHelper.accessor("usuario.nome", {
      header: "Contato",
      cell: (info) => (
        <span className="text-gray-700">{info.getValue() || "-"}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Ações",
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => navigate(`/atualizaroportunidade/${id}`)}
              className="p-1 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
              aria-label="Editar oportunidade"
            >
              <PencilIcon
                size={20}
                className="text-blue-500 group-hover:text-blue-700 transition-colors"
              />
            </button>
            <button
              onClick={() => navigate(`/deletaroportunidade/${id}`)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
              aria-label="Excluir oportunidade"
            >
              <TrashIcon
                size={20}
                className="text-red-500 group-hover:text-red-700 transition-colors"
              />
            </button>
            <button
              onClick={() => onStatus(info.row.original)}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group"
              aria-label="Mudar status"
            >
              <ArrowsClockwiseIcon
                size={20}
                className="text-green-600 group-hover:text-green-800 transition-colors"
              />
            </button>
          </div>
        );
      },
    }),
  ];
}