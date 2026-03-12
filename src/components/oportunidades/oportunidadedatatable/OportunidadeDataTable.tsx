import {
  ArrowsClockwiseIcon,
  CalendarBlankIcon,
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon
} from '@phosphor-icons/react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../../contexts/AuthContext'
import type Oportunidade from '../../../models/Oportunidade'
import { listar } from '../../../services/Service'
import { formatarData } from '../../../utils/FormatarData'
import { formatarMoeda } from '../../../utils/FormatarMoeda'
import MudarStatusModal from '../../mudarstatus/mudarstatusmodal/MudarStatusModal'
import { createOportunidadeColumns } from './OportunidadeColumns'

interface OportunidadeDataTableProps {
  oportunidades: Oportunidade[]
}

function OportunidadeDataTable({ oportunidades }: OportunidadeDataTableProps) {
  const navigate = useNavigate()
  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  const [data, setData] = useState<Oportunidade[]>(oportunidades)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedOportunidade, setSelectedOportunidade] = useState<Oportunidade | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleStatus = (oportunidade: Oportunidade) => {
    setSelectedOportunidade(oportunidade)
    setIsPopupOpen(true)
  }

  async function refresh() {
    try {
      await listar('/oportunidades', setData, {
        headers: {
          Authorization: token,
        },
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
  }

  const columns = createOportunidadeColumns({
    onStatus: handleStatus,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  // Função para obter configuração de status
  const getStatusConfig = (status: number) => {
    const configs = {
      1: { label: "Aberta", classes: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      2: { label: "Fechada", classes: "bg-green-100 text-green-800 border-green-300" },
      3: { label: "Perdida", classes: "bg-red-100 text-red-800 border-red-300" },
    };
    return configs[status as keyof typeof configs] || {
      label: "Desconhecida",
      classes: "bg-gray-100 text-gray-800 border-gray-300",
    };
  }

  return (
    <div className="space-y-6">
      {/* Barra de Pesquisa e Botão */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="oportunidade"
            name="oportunidade"
            placeholder="Pesquisar oportunidades..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent
              transition-all duration-300 text-sm"
          />
        </div>
        <button
          onClick={() => navigate('/cadastraroportunidade')}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-600 to-zinc-700 
            hover:from-zinc-700 hover:to-zinc-800 px-6 py-2.5 text-white font-bold rounded-xl
            shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 whitespace-nowrap"
        >
          <PlusIcon size={20} />
          <span className="hidden sm:inline">Nova Oportunidade</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          {table.getFlatHeaders().map((header, index) => {
            const colSpan = 
              index === 5 ? 'col-span-2' : 
              index === 0 || index === 4 ? 'col-span-3' : 'col-span-1'
            return (
              <div
                key={header.id}
                className={`${colSpan} py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider
                  cursor-pointer hover:bg-gray-200 transition-colors duration-200 text-center`}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            )
          })}
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-12 hover:bg-gray-50 transition-colors duration-200"
            >
              {row.getVisibleCells().map((cell, index) => {
                const colSpan = 
                  index === 5 ? 'col-span-2' : 
              	  index === 0 || index === 4 ? 'col-span-3' : 'col-span-1'
                const justifyCenter = index === 3 || index === 6
                return (
                  <div
                    key={cell.id}
                    className={`${colSpan} flex items-center px-4 py-4 text-sm
                      ${justifyCenter ? 'justify-center' : 'justify-start'}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Cards Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {table.getRowModel().rows.map((row) => {
          const oportunidade = row.original
          const statusConfig = getStatusConfig(oportunidade.status)
          
          return (
            <div
              key={row.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 space-y-4
                hover:shadow-xl transition-all duration-300"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                    {oportunidade.descricao}
                  </h3>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <span>{formatarMoeda(oportunidade.valor)}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full 
                    text-xs font-bold border-2 whitespace-nowrap ${statusConfig.classes}`}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Data de Término */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <CalendarBlankIcon size={14} />
                  <span className="font-semibold">Término</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {oportunidade.dataFechamento
                    ? formatarData(oportunidade.dataFechamento)
                    : "-"}
                </p>
              </div>

              {/* Cliente e Contato */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-500">Cliente:</span>
                  <span className="text-gray-700">{oportunidade.cliente?.nome || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-500">Contato:</span>
                  <span className="text-gray-700">{oportunidade.usuario?.nome || "-"}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/atualizaroportunidade/${oportunidade.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600
                    text-white font-semibold py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <PencilIcon size={18} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleStatus(oportunidade)}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600
                    text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <ArrowsClockwiseIcon size={18} />
                </button>
                <button
                  onClick={() => navigate(`/deletaroportunidade/${oportunidade.id}`)}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                    text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 
        bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border-2 border-gray-300 hover:border-zinc-500 
              hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-95"
            aria-label="Página anterior"
          >
            <CaretLeftIcon size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border-2 border-gray-300 hover:border-zinc-500 
              hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-95"
            aria-label="Próxima página"
          >
            <CaretRightIcon size={20} className="text-gray-700" />
          </button>
        </div>
        <span className="text-sm font-medium text-gray-600">
          Página <span className="font-bold text-zinc-600">{table.getState().pagination.pageIndex + 1}</span> de{' '}
          <span className="font-bold text-zinc-600">{table.getPageCount()}</span>
        </span>
      </div>

      {/* Modal de Mudar Status */}
      {selectedOportunidade && (
        <MudarStatusModal
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false)
            setSelectedOportunidade(null)
            refresh()
          }}
          oportunidade={selectedOportunidade}
        />
      )}
    </div>
  )
}

export default OportunidadeDataTable