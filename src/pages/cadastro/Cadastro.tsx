import { type ChangeEvent, type SyntheticEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import type Usuario from "../../models/Usuario"
import { cadastrarUsuario } from "../../services/Service"
import { ToastAlerta } from "../../utils/ToastAlerta"
import {
	formularioValido,
	validarCampoCadastro,
	validarFormularioCadastro,
} from "../../validations/ValidacaoCadastro"

function Cadastro() {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [confirmaSenha, setConfirmaSenha] = useState<string>("")
	const [erros, setErros] = useState<Record<string, string>>({})

	const [usuario, setUsuario] = useState<Usuario>({
		id: 0,
		nome: "",
		usuario: "",
		senha: "",
		foto: "",
	})

	useEffect(() => {
		if (usuario.id !== 0) {
			retornar()
		}
	}, [usuario])

	function retornar() {
		navigate("/login")
	}

	function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target

		setUsuario({
			...usuario,
			[name]: value,
		})

		const erro = validarCampoCadastro(name, value)
		setErros((prev) => ({ ...prev, [name]: erro }))
	}

	function handleConfirmaSenha(e: ChangeEvent<HTMLInputElement>) {
		const valor = e.target.value
		setConfirmaSenha(valor)

		const erro = validarCampoCadastro("confirmaSenha", valor)
		setErros((prev) => ({ ...prev, confirmaSenha: erro }))
	}

	async function cadastrarNovoUsuario(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		const errosValidacao = validarFormularioCadastro(usuario, confirmaSenha)
		setErros(errosValidacao)

		if (!formularioValido(errosValidacao)) {
			ToastAlerta("Por favor, corrija os erros no formulário", "erro")
			return
		}

		setIsLoading(true)

		try {
			await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)
			ToastAlerta("Usuário cadastrado com sucesso!", "sucesso")
		} catch (error: any) {
			ToastAlerta("Erro ao cadastrar o usuário!", "erro")
		}

		setIsLoading(false)
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 h-screen place-items-center font-bold bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
			{/* Imagem de Fundo - Desktop */}
			<div
				style={{
					backgroundImage: `url("https://ik.imagekit.io/vzr6ryejm/crm/bg_08.jpg")`,
				}}
				className="lg:block hidden bg-no-repeat w-full h-screen bg-cover bg-center relative
					before:content-[''] before:absolute before:inset-0 before:bg-linear-to-br 
					before:from-zinc-600/20 before:to-transparent"
			>
				<div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
			</div>

			{/* Formulário */}
			<div className="flex justify-center items-center w-full h-screen px-6 lg:px-12">
				<form
					className="flex flex-col justify-center items-center gap-3 w-full max-w-lg bg-white px-10 py-8 rounded-3xl shadow-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-3xl"
					onSubmit={cadastrarNovoUsuario}
				>
					{/* Cabeçalho */}
					<div className="text-center mb-2">
						<h2 className="text-4xl mb-2 bg-linear-to-r from-zinc-600 to-zinc-700 bg-clip-text text-transparent">
							Cadastrar
						</h2>
						<p className="text-gray-500 text-sm font-normal">
							Crie sua conta para começar
						</p>
					</div>

					{/* Campo Nome */}
					<div className="flex flex-col w-full gap-2">
						<label htmlFor="nome" className="text-gray-700 text-sm font-semibold">
							Nome Completo
						</label>
						<input
							type="text"
							id="nome"
							name="nome"
							placeholder="Digite seu nome completo"
							className={`border-2 rounded-lg px-4 py-2.5 bg-white text-slate-900 text-sm font-normal
								focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
									erros.nome
										? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
										: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
								}`}
							value={usuario.nome}
							onChange={atualizarEstado}
							required
						/>
						{erros.nome && (
							<span className="text-red-500 text-xs">{erros.nome}</span>
						)}
					</div>

					{/* Campo Usuário (E-mail) */}
					<div className="flex flex-col w-full gap-2">
						<label htmlFor="usuario" className="text-gray-700 text-sm font-semibold">
							E-mail
						</label>
						<input
							type="email"
							id="usuario"
							name="usuario"
							placeholder="seu@email.com"
							className={`border-2 rounded-lg px-4 py-2.5 bg-white text-slate-900 text-sm font-normal
								focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
									erros.usuario
										? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
										: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
								}`}
							value={usuario.usuario}
							onChange={atualizarEstado}
							required
						/>
						{erros.usuario && (
							<span className="text-red-500 text-xs">{erros.usuario}</span>
						)}
					</div>

					{/* Campo Foto */}
					<div className="flex flex-col w-full gap-2">
						<label htmlFor="foto" className="text-gray-700 text-sm font-semibold">
							Foto (URL)
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
							value={usuario.foto}
							onChange={atualizarEstado}
							required
						/>
						{erros.foto && (
							<span className="text-red-500 text-xs">{erros.foto}</span>
						)}
					</div>

					{/* Campos Senha e Confirmar Senha */}
					<div className="flex gap-4 w-full">
						<div className="flex flex-col w-1/2 gap-2">
							<label htmlFor="senha" className="text-gray-700 text-sm font-semibold">
								Senha
							</label>
							<input
								type="password"
								id="senha"
								name="senha"
								placeholder="Mín. 8 caracteres"
								className={`border-2 rounded-lg px-4 py-2.5 bg-white text-slate-900 text-sm font-normal
									focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
										erros.senha
											? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
											: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
									}`}
								value={usuario.senha}
								onChange={atualizarEstado}
								minLength={8}
								required
							/>
							{erros.senha && (
								<span className="text-red-500 text-xs">{erros.senha}</span>
							)}
						</div>

						<div className="flex flex-col w-1/2 gap-2">
							<label htmlFor="confirmarSenha" className="text-gray-700 text-sm font-semibold">
								Confirmar Senha
							</label>
							<input
								type="password"
								id="confirmarSenha"
								name="confirmarSenha"
								placeholder="Digite novamente"
								className={`border-2 rounded-lg px-4 py-2.5 bg-white text-slate-900 text-sm font-normal
									focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
										erros.confirmaSenha || erros.senhasIguais
											? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
											: "border-gray-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
									}`}
								value={confirmaSenha}
								onChange={handleConfirmaSenha}
								minLength={8}
								required
							/>
							{erros.confirmaSenha && (
								<span className="text-red-500 text-xs">{erros.confirmaSenha}</span>
							)}
							{erros.senhasIguais && (
								<span className="text-red-500 text-xs">{erros.senhasIguais}</span>
							)}
						</div>
					</div>

					<span className="text-xs text-gray-500 font-normal text-center w-full">
						A senha deve ter no mínimo 8 caracteres
					</span>

					{/* Botões */}
					<div className="flex justify-between gap-4 w-full mt-3">
						<button
							type="button"
							className="rounded-lg bg-gray-200 hover:bg-gray-300 
								active:scale-95 py-2.5 w-1/2 text-gray-800 font-semibold text-sm
								transition-all duration-200"
							onClick={retornar}
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="rounded-lg bg-linear-to-r from-zinc-600 to-zinc-700 flex justify-center items-center
								hover:from-zinc-700 hover:to-zinc-800 active:scale-95
								disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
								py-2.5 w-1/2 text-white font-semibold text-sm
								transition-all duration-300"
						>
							{isLoading ? (
								<ClipLoader color="#ffffff" size={20} />
							) : (
								<span>Cadastrar</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Cadastro