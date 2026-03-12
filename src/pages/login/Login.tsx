import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { type ChangeEvent, type SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import AuthContext from '../../contexts/AuthContext'
import type UsuarioLogin from '../../models/UsuarioLogin'

function Login() {
	const navigate = useNavigate()

	const { usuario, handleLogin, isLoading } = useContext(AuthContext)

	const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>({
		id: 0, 
		nome: "",
		usuario: "",
		foto: "",
		senha: "",
  		token: ""
	})

	const [showPassword, setShowPassword] = useState(false)

	useEffect(() => {
		if (usuario.token !== '') {
			navigate('/home')
		}
	}, [usuario])

	function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
		setUsuarioLogin({
			...usuarioLogin,
			[e.target.name]: e.target.value,
		})
	}

	function login(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()
		handleLogin(usuarioLogin)
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 h-screen place-items-center font-bold bg-gradient-to-br from-gray-50 to-gray-100">
			{/* Formulário */}
			<div className="flex justify-center items-center w-full h-full px-8 lg:px-0">
				<form
					className="flex justify-center items-center flex-col w-full max-w-md gap-6 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-3xl"
					onSubmit={login}
				>
					{/* Cabeçalho */}
					<div className="text-center mb-4">
						<h2 className="text-5xl mb-2 bg-gradient-to-r from-zinc-600 to-zinc-800 bg-clip-text text-transparent">
							Entrar
						</h2>
						<p className="text-gray-500 text-sm font-normal">
							Acesse sua conta para continuar
						</p>
					</div>

					{/* Campo Usuário */}
					<div className="flex flex-col w-full gap-2">
						<label 
							htmlFor="usuario"
							className="text-slate-700 text-sm font-semibold"
						>
							Usuário
						</label>
						<input
							type="text"
							id="usuario"
							name="usuario"
							placeholder="Digite seu usuário"
							className="border-2 border-gray-300 rounded-xl p-3 bg-white text-slate-900 font-normal
								focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none
								transition-all duration-300 placeholder:text-gray-400"
							value={usuarioLogin.usuario}
							onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
							required
						/>
					</div>

					{/* Campo Senha */}
					<div className="relative flex flex-col w-full gap-2">
						<label 
							htmlFor="senha"
							className="text-slate-700 text-sm font-semibold"
						>
							Senha
						</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								id="senha"
								name="senha"
								placeholder="Digite sua senha"
								className="w-full border-2 border-gray-300 rounded-xl p-3 pr-12 bg-white text-slate-900 font-normal
									focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none
									transition-all duration-300 placeholder:text-gray-400"
								value={usuarioLogin.senha}
								onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
								required
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-600 
									transition-colors duration-200 focus:outline-none"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
							>
								{showPassword ? (
									<EyeSlashIcon size={22} weight="regular" />
								) : (
									<EyeIcon size={22} weight="regular" />
								)}
							</button>
						</div>
					</div>

					{/* Botão Entrar */}
					<button
						type="submit"
						disabled={isLoading}
						className="rounded-xl bg-gradient-to-r from-zinc-600 to-zinc-700 flex justify-center items-center
							hover:from-zinc-700 hover:to-zinc-900 active:scale-95
							disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
							text-white w-full py-3.5 font-bold text-base
							shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
					>
						{isLoading ? (
							<div className="flex items-center justify-center h-6">
								<ClipLoader
									color="#ffffff"
									size={24}
								/>
							</div>
						) : (
							<span>Entrar</span>
						)}
					</button>

					{/* Divisor */}
					<div className="relative w-full my-2">
						<hr className="border-gray-300" />
						<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
							bg-white px-4 text-gray-500 text-xs font-normal">
							OU
						</span>
					</div>

					{/* Link Cadastro */}
					<p className="text-slate-600 text-sm font-normal text-center">
						Ainda não tem uma conta?{' '}
						<Link
							to="/cadastro"
							className="text-zinc-600 hover:text-zinc-800 font-semibold hover:underline 
								transition-colors duration-200"
						>
							Cadastre-se
						</Link>
					</p>
				</form>
			</div>

			{/* Imagem de Fundo - Desktop */}
			<div
				style={{
					backgroundImage: `url("https://ik.imagekit.io/vzr6ryejm/crm/bg_05.jpg?updatedAt=1729453208523")`,
				}}
				className="lg:block hidden bg-no-repeat w-full h-full bg-cover bg-center relative
					before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br 
					before:from-cyan-600/20 before:to-transparent"
			>
				{/* Overlay decorativo */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
			</div>
		</div>
	)
}

export default Login