import { type ChangeEvent, type SyntheticEvent, useContext, useEffect, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import AuthContext from "../../../contexts/AuthContext"
import type Cliente from "../../../models/Cliente"
import { atualizar, cadastrar, listar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"
import {
	validarCampoCliente,
	validarFormularioCliente,
} from "../../../validations/ValidacaoCliente"
import { formularioValido } from "../../../validations/ValidacaoOportunidade"


function FormCliente() {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [cliente, setCliente] = useState<Cliente>({} as Cliente)
	const [erros, setErros] = useState<Record<string, string>>({})

	const { usuario, handleLogout, isLogout } = useContext(AuthContext)
	const token = usuario.token
	const { id } = useParams<{ id: string }>()

	function retornar() {
		navigate("/clientes")
	}
	
	async function buscarPorId(id: string) {
		try {
			await listar(`/clientes/${id}`, setCliente, {
				headers: {
					Authorization: token,
				},
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			} else {
				ToastAlerta("Cliente não Encontrado!", "erro")
				retornar()
			}
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
		if (id !== undefined) {
			buscarPorId(id)
			setIsEditing(true)
		}
	}, [id])

	function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target

		setCliente({
			...cliente,
			[name]: value,
		})

		const erro = validarCampoCliente(name, value)
		setErros((prev) => ({ ...prev, [name]: erro }))
	}

	async function gerarNovoCliente(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		const errosValidacao = validarFormularioCliente(cliente)
		setErros(errosValidacao)

		if (!formularioValido(errosValidacao)) {
			ToastAlerta("Por favor, corrija os erros no formulário", "erro")
			return
		}

		setIsLoading(true)

		if (id !== undefined) {
			try {
				await atualizar(`/clientes`, cliente, setCliente, {
					headers: {
						Authorization: token,
					},
				})
				ToastAlerta("Cliente atualizado com sucesso", "sucesso")
			} catch (error: any) {
				if (error.toString().includes("401")) {
					handleLogout()
				} else {
					ToastAlerta("Erro ao atualizar o Cliente!", "erro")
				}
			}
		} else {
			try {
				await cadastrar(`/clientes`, cliente, setCliente, {
					headers: {
						Authorization: token,
					},
				})
				ToastAlerta("Cliente cadastrado com sucesso", "sucesso")
			} catch (error: any) {
				if (error.toString().includes("401")) {
					handleLogout()
				} else {
					ToastAlerta("Erro ao cadastrar o Cliente!", "erro")
				}
			}
		}

		setIsLoading(false)
		retornar()
	}

	return (
		<div className="container flex flex-col mx-auto items-center">
			{/* Header */}
			<h1 className="text-4xl text-center my-8">
				{isEditing ? "Editar Cliente" : "Cadastrar Cliente"}
			</h1>

			{/* Form Container */}
			<div className="flex flex-col w-full max-w-2xl gap-4 mb-8">
				<form
					className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
					onSubmit={gerarNovoCliente}
				>
					{/* Nome */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="nome" className="text-sm font-semibold text-gray-700">
							Nome
						</label>
						<input
							type="text"
							placeholder="Nome do Cliente"
							id="nome"
							name="nome"
							required
							value={cliente.nome || ""}
							onChange={atualizarEstado}
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.nome
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
						/>
						{erros.nome && <span className="text-red-500 text-xs">{erros.nome}</span>}
					</div>

					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="cnpj" className="text-gray-700 text-sm font-semibold">
							CNPJ
						</label>

						<PatternFormat
							id="cnpj"
							name="cnpj"
							value={cliente.cnpj || ""}
							onValueChange={(values) => {
								atualizarEstado({
									target: {
										name: "cnpj",
										value: values.value, // apenas números
									},
								} as unknown as React.ChangeEvent<HTMLInputElement>)
							}}
							format="##.###.###/####-##"
							placeholder="00.000.000/0000-00"
							className={`border-2 rounded-lg px-4 py-2.5 bg-white text-slate-900 text-sm font-normal
									focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
										erros.cnpj
											? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
											: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
									}`}
							required
							mask="_"
						/>

						{erros.cnpj && (
							<span className="text-red-500 text-xs">{erros.cnpj}</span>
						)}
					</div>

					{/* E-mail */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="email" className="text-sm font-semibold text-gray-700">
							E-mail
						</label>
						<input
							type="email"
							placeholder="E-mail do Cliente"
							id="email"
							name="email"
							required
							value={cliente.email || ""}
							onChange={atualizarEstado}
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.email
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
						/>
						{erros.email && <span className="text-red-500 text-xs">{erros.email}</span>}
					</div>

					{/* Campos em duas colunas - Telefone e Foto */}
					<div className="flex gap-4 w-full mb-6">
						<div className="flex flex-col w-1/2 gap-2">
							<label
								htmlFor="telefone"
								className="text-gray-700 text-sm font-semibold"
							>
								Telefone Fixo
							</label>
							<PatternFormat
								id="telefone"
								name="telefone"
								value={cliente.telefone || ""}
								onValueChange={(values) => {
									atualizarEstado({
										target: {
											name: "telefone",
											value: values.value, // apenas números
										},
									} as unknown as React.ChangeEvent<HTMLInputElement>)
								}}
								format="(##) ####-####"
								placeholder="(00) 0000-0000"
								className={`border-2 rounded-lg px-4 py-2.5 bg-white text-slate-900 text-sm font-normal
									focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
											erros.telefone
												? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
												: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
										}`}
								required
								mask="_"
							/>

							{erros.telefone && (
								<span className="text-red-500 text-xs">{erros.telefone}</span>
							)}
						</div>

						<div className="flex flex-col w-1/2 gap-2">
							<label htmlFor="foto" className="text-gray-700 text-sm font-semibold">
								Logo (URL)
							</label>
							<input
								type="url"
								id="foto"
								name="foto"
								placeholder="https://..."
								className={`border-2 rounded-lg px-4 py-2.5 bg-white text-slate-900 text-sm font-normal
									focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
										erros.foto
											? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
											: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
									}`}
								value={cliente.foto || ""}
								onChange={atualizarEstado}
								required
							/>
							{erros.foto && (
								<span className="text-red-500 text-xs">{erros.foto}</span>
							)}
						</div>
					</div>

					{/* Histórico */}
					<div className="flex flex-col gap-2 mb-6">
						<label htmlFor="historico" className="text-sm font-semibold text-gray-700">
							Histórico
						</label>
						<input
							type="text"
							placeholder="Histórico do Cliente"
							id="historico"
							name="historico"
							required
							value={cliente.historico || ""}
							onChange={atualizarEstado}
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.historico
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
						/>
						{erros.historico && (
							<span className="text-red-500 text-xs">{erros.historico}</span>
						)}
					</div>

					{/* Botão Submit */}
					<div className="flex justify-center pt-3">
						<button
							type="submit"
							disabled={isLoading}
							className="flex justify-center items-center rounded disabled:bg-gray-300 bg-gradient-to-r 
								from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 text-white font-bold 
								w-1/2 mx-auto py-2.5 transition-all duration-200 active:scale-95"
						>
							{isLoading ? (
								<ClipLoader color="#ffffff" size={20} />
							) : (
								<span>{isEditing ? "Atualizar" : "Cadastrar"}</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default FormCliente
