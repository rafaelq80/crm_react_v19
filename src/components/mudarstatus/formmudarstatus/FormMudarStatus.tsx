import { useContext, useState, type SyntheticEvent } from 'react'
import type Oportunidade from '../../../models/Oportunidade'
import { atualizar } from '../../../services/Service'
import { ToastAlerta } from '../../../utils/ToastAlerta'
import AuthContext from '../../../contexts/AuthContext'

interface MudarStatusProps {
  oportunidade: Oportunidade
  onClose: () => void
}

function FormMudarStatus ({ 
  oportunidade, 
  onClose, 
}: MudarStatusProps) {
  const [updateOportunidade, setUpdateOportunidade] = useState<Oportunidade>(oportunidade)
  const [selectedStatus, setSelectedStatus] = useState(oportunidade.status)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token
  
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await atualizar(
        `/oportunidades/${oportunidade.id}/status/${selectedStatus}`, 
        updateOportunidade, 
        setUpdateOportunidade, 
        {
          headers: { Authorization: token },
        }
      )
      
      ToastAlerta("Status atualizado com sucesso", "sucesso")
      onClose()
    } catch (error: any) {
      if (error.toString().includes("401")) {
        handleLogout()
      } else {
        ToastAlerta("Erro ao atualizar status", "erro")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor='status' className="block text-sm font-semibold text-gray-700 mb-2">
          Status
        </label>
        <select
          id='status'
          name='status'
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(Number(e.target.value))}
          className="w-full px-4 py-2.5 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200
            text-gray-800 font-medium bg-white hover:border-gray-400"
          disabled={isSubmitting}
        >
          <option value={1}>Aberta</option>
          <option value={2}>Fechada</option>
          <option value={3}>Perdida</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold 
            rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-zinc-600 to-zinc-700 
            hover:from-zinc-700 hover:to-zinc-800 text-white font-semibold rounded-lg 
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Confirmar"}
        </button>
      </div>
    </form>
  )
}

export default FormMudarStatus