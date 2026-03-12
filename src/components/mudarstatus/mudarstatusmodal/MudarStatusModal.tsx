import { X } from '@phosphor-icons/react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import type Oportunidade from "../../../models/Oportunidade"
import FormMudarStatus from '../formmudarstatus/FormMudarStatus'

interface MudarStatusModalProps {
  isOpen: boolean
  onClose: () => void
  oportunidade: Oportunidade
}

function MudarStatusModal({ 
  isOpen, 
  onClose, 
  oportunidade,
}: MudarStatusModalProps) {
  return (
    <Popup
      open={isOpen}
      onClose={onClose}
      modal
      closeOnDocumentClick
      contentStyle={{
        padding: 0,
        border: 'none',
        background: 'transparent',
        width: 'auto',
        maxWidth: 'calc(100% - 2rem)',
      }}
      overlayStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Modal - caixa de diálogo centralizada */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            Alterar Status
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Fechar modal"
          >
            <X size={24} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6">
          <FormMudarStatus
            oportunidade={oportunidade}
            onClose={onClose}
          />
        </div>
      </div>
    </Popup>
  )
}

export default MudarStatusModal