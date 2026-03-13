import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react"
import { NumericFormat } from "react-number-format"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { AuthContext } from "../../../contexts/AuthContext"
import type Cliente from "../../../models/Cliente"
import type Oportunidade from "../../../models/Oportunidade"
import { atualizar, cadastrar, listar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"
import {
	formularioValido,
	validarCampoOportunidade,
	validarFormularioOportunidade,
} from "../../../validations/ValidacaoOportunidade"

function FormOportunidade() {
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isEditing, setIsEditing] = useState<boolean>(false)

	const [clientes, setClientes] = useState<Cliente[]>([])

	const [erros, setErros] = useState<Record<string, string>>({})

	const [cliente, setCliente] = useState<Cliente>({
		id: 0,
		nome: "",
		cnpj: "",
		email: "",
		telefone: "",
		foto: "",
		historico: "string",
	})

	const [oportunidade, setOportunidade] = useState<Oportunidade>({
		status: 1,
	} as Oportunidade)

	const { id } = useParams<{ id: string }>()

	const { usuario, handleLogout, isLogout } = useContext(AuthContext)
	const token = usuario.token

	function retornar() {
		navigate("/oportunidades")
	}
	
	async function buscarOportunidadePorId(id: string) {
		try {
			await listar(`/oportunidades/${id}`, setOportunidade, {
				headers: {
					Authorization: token,
				},
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			} else {
				ToastAlerta("Oportunidade não Encontrada!", "erro")
				retornar()
			}
		}
	}

	async function buscarClientePorId(id: string) {
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

	async function buscarClientes() {
		try {
			await listar(`/clientes`, setClientes, {
				headers: { Authorization: token },
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
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
		buscarClientes()
		if (id !== undefined) {
			buscarOportunidadePorId(id)
			setIsEditing(true)
		}
	}, [id])

	useEffect(() => {
		if (cliente.id !== 0) {
			setOportunidade((prevState) => ({
				...prevState,
				cliente: cliente,
				usuario: usuario,
			}))
		}
	}, [cliente])

	function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
		const valor = Number(e.target.value)
		setOportunidade((prevState) => ({
			...prevState,
			status: valor,
		}))

		const erro = validarCampoOportunidade("status", valor.toString())
		setErros((prev) => ({ ...prev, status: erro }))
	}

	function handleClienteChange(e: ChangeEvent<HTMLSelectElement>) {
		const selectedId = e.target.value
		if (selectedId) {
			buscarClientePorId(selectedId)

			const erro = validarCampoOportunidade("cliente", selectedId)
			setErros((prev) => ({ ...prev, cliente: erro }))
		}
	}

	function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
		const { type, value, name } = e.target

		let valor: string | number = value

		switch (type) {
			case "number":
			case "range":
				valor = value === "" ? "" : parseFloat(Number(value).toFixed(2))
				break
			case "date":
				valor = value
				break
			default:
				if (!isNaN(Number(value)) && value !== "") {
					valor = parseFloat(Number(value).toFixed(2))
				}
		}

		setOportunidade((prevState) => ({
			...prevState,
			[name]: valor,
		}))

		const erro = validarCampoOportunidade(name, valor.toString())
		setErros((prev) => ({ ...prev, [name]: erro }))
	}

	async function gerarNovaOportunidade(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		const errosValidacao = validarFormularioOportunidade(oportunidade)
		setErros(errosValidacao)

		if (!formularioValido(errosValidacao)) {
			ToastAlerta("Por favor, corrija os erros no formulário", "erro")
			return
		}

		setIsLoading(true)

		if (id !== undefined) {
			try {
				await atualizar(`/oportunidades`, oportunidade, setOportunidade, {
					headers: {
						Authorization: token,
					},
				})
				ToastAlerta("Oportunidade atualizada com sucesso", "sucesso")
			} catch (error: any) {
				if (error.toString().includes("401")) {
					handleLogout()
				} else {
					ToastAlerta("Erro ao atualizar a Oportunidade!", "erro")
				}
			}
		} else {
			try {
				await cadastrar(`/oportunidades`, oportunidade, setOportunidade, {
					headers: {
						Authorization: token,
					},
				})
				ToastAlerta("Oportunidade cadastrada com sucesso", "sucesso")
			} catch (error: any) {
				if (error.toString().includes("401")) {
					handleLogout()
				} else {
					ToastAlerta("Erro ao cadastrar a Oportunidade!", "erro")
				}
			}
		}

		setIsLoading(false)
		retornar()
	}

	const clienteSelecionado = oportunidade.cliente?.id > 0

	return (
		<div className="container flex flex-col mx-auto items-center">
			{/* Header */}
			<h1 className="text-4xl text-center my-8">
				{isEditing ? "Editar Oportunidade" : "Cadastrar Oportunidade"}
			</h1>

			{/* Form Container */}
			<div className="flex flex-col w-full max-w-2xl gap-4 mb-8">
				<form
					className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
					onSubmit={gerarNovaOportunidade}
				>
					{/* Descrição */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="descricao" className="text-sm font-semibold text-gray-700">
							Oportunidade
						</label>
						<input
							id="descricao"
							value={oportunidade.descricao || ""}
							onChange={atualizarEstado}
							type="text"
							placeholder="Insira aqui o nome da Oportunidade"
							name="descricao"
							required
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.descricao
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
						/>
						{erros.descricao && <span className="text-red-500 text-xs">{erros.descricao}</span>}
					</div>

					{/* Valor */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="valor" className="text-sm font-semibold text-gray-700">
							Valor da Oportunidade
						</label>
						<NumericFormat
							id="valor"
							name="valor"
							value={oportunidade.valor}
							onValueChange={(values) => {
								setOportunidade({
									...oportunidade,
									valor: values.floatValue ?? 0, // garante number
								})
							}}
							thousandSeparator="."
							decimalSeparator=","
							decimalScale={2}
							fixedDecimalScale
							prefix="R$ "
							placeholder="Adicione aqui o valor da Oportunidade"
							required
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.valor
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
						/>

						{erros.valor && <span className="text-red-500 text-xs">{erros.valor}</span>}
					</div>

					{/* Data de Fechamento */}
					<div className="flex flex-col gap-2 mb-5">
						<label
							htmlFor="dataFechamento"
							className="text-sm font-semibold text-gray-700"
						>
							Data de Fechamento
						</label>
						<input
							type="date"
							id="dataFechamento"
							name="dataFechamento"
							placeholder="Data de Fechamento"
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.dataFechamento
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
							onChange={atualizarEstado}
							value={oportunidade.dataFechamento || ""}
							required
						/>
						{erros.dataFechamento && (
							<span className="text-red-500 text-xs">{erros.dataFechamento}</span>
						)}
					</div>

					{/* Status */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="status" className="text-sm font-semibold text-gray-700">
							Status da Oportunidade
						</label>
						<select
							name="status"
							id="status"
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.status
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
							onChange={handleStatusChange}
							value={oportunidade.status ?? 1}
						>
							<option value={1}>Aberta</option>
							<option value={2}>Fechada</option>
							<option value={3}>Perdida</option>
						</select>
						{erros.status && (
							<span className="text-red-500 text-xs">{erros.status}</span>
						)}
					</div>

					{/* Cliente */}
					<div className="flex flex-col gap-2 mb-6">
						<label htmlFor="cliente" className="text-sm font-semibold text-gray-700">
							Cliente
						</label>
						<select
							name="cliente"
							id="cliente"
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.cliente
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
							}`}
							onChange={handleClienteChange}
							value={oportunidade.cliente?.id || ""}
						>
							<option value="" disabled>
								Selecione um Cliente
							</option>
							{clientes.map((cliente) => (
								<option key={cliente.id} value={cliente.id}>
									{cliente.nome}
								</option>
							))}
						</select>
						{erros.cliente && (
							<span className="text-red-500 text-xs">{erros.cliente}</span>
						)}
					</div>

					{/* Botão Submit */}
					<div className="flex justify-center pt-3">
						<button
							type="submit"
							disabled={!clienteSelecionado}
							className="flex justify-center items-center rounded disabled:bg-gray-300 bg-linear-to-r 
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

export default FormOportunidade
