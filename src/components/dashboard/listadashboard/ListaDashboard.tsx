import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SyncLoader } from "react-spinners"
import AuthContext from "../../../contexts/AuthContext"
import type Oportunidade from "../../../models/Oportunidade"
import { listar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"
import Dashboard from "../dashboard/Dashboard"

function ListaDashboard() {
	const navigate = useNavigate()
	const [oportunidades, setOportunidades] = useState<Oportunidade[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const { usuario, handleLogout, isLogout } = useContext(AuthContext)
	const token = usuario.token

	async function buscarOportunidades() {
		try {
			setIsLoading(true)
			await listar("/oportunidades", setOportunidades, {
				headers: {
					Authorization: token,
				},
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			}
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (token === "") {
			if (!isLogout) {
				ToastAlerta("Você precisa estar logado!", "info")
			}
			navigate("/")
		}
	}, [token])

	useEffect(() => {
		buscarOportunidades()
	}, [])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="text-center space-y-4">
					<SyncLoader color="#18181b" size={16} />
					<p className="text-gray-600 font-medium">Carregando dashboard...</p>
				</div>
			</div>
		)
	}

	// Alerta quando não há dados
	if (oportunidades.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
				<div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12 max-w-md w-full text-center space-y-6">
					<div className="flex justify-center">
						<div className="w-24 h-24 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-full flex items-center justify-center">
							<svg 
								className="text-zinc-600" 
								width="48"
								height="48"
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={2} 
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
								/>
							</svg>
						</div>
					</div>
					
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-gray-800">
							Nenhuma oportunidade encontrada
						</h2>
						<p className="text-gray-500">
							Comece cadastrando sua primeira oportunidade
						</p>
					</div>

					<button
						onClick={() => navigate('/cadastraroportunidade')}
						className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-zinc-600 to-zinc-700 
							hover:from-zinc-700 hover:to-zinc-800 px-6 py-3 text-white font-bold rounded-xl
							shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
					>
						<svg 
							width="24"
							height="24"
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth={2} 
								d="M12 4v16m8-8H4" 
							/>
						</svg>
						Cadastrar Primeira Oportunidade
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
			<Dashboard oportunidades={oportunidades} />
		</div>
	)
}

export default ListaDashboard