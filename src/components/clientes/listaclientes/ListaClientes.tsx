import { PlusIcon, SmileySadIcon } from '@phosphor-icons/react'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import AuthContext from '../../../contexts/AuthContext'
import type Cliente from '../../../models/Cliente'
import { listar } from '../../../services/Service'
import { ToastAlerta } from '../../../utils/ToastAlerta'
import ClienteDataTable from '../clientedatatable/ClienteDataTable'

function ListaClientes() {

  const navigate = useNavigate()

  const [clientes, setClientes] = useState<Cliente[]>([])

  const { usuario, handleLogout, isLogout } = useContext(AuthContext)
  const token = usuario.token

  const [isLoading, setIsLoading] = useState(true)

  async function buscarClientes() {
    setIsLoading(true)
    try {
      await listar('/clientes', setClientes, {
        headers: {
          Authorization: token,
        },
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token === '') {
		if (!isLogout){
      		ToastAlerta('Você precisa estar logado', 'info')
		}
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    buscarClientes()
  }, [])

  // Estado de Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <SyncLoader color="#18181b" size={16} />
          <p className="text-gray-600 font-medium">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  // Estado Vazio
  if (clientes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-linear-to-br from-zinc-100 to-zinc-200 rounded-full flex items-center justify-center">
              <SmileySadIcon size={48} className="text-zinc-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Nenhum cliente encontrado
            </h2>
            <p className="text-gray-500">
              Comece cadastrando seu primeiro cliente
            </p>
          </div>

          <button
            onClick={() => navigate('/cadastrarcliente')}
            className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-zinc-600 to-zinc-700 
              hover:from-zinc-700 hover:to-zinc-800 px-6 py-3 text-white font-bold rounded-xl
              shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <PlusIcon size={24} />
            Cadastrar Primeiro Cliente
          </button>
        </div>
      </div>
    )
  }

  // Lista de Clientes
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header */}
        <div className="py-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl my-4">
                Clientes
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Total de {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'} cadastrado{clientes.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <ClienteDataTable clientes={clientes} />
      </div>
    </div>
  )
}

export default ListaClientes