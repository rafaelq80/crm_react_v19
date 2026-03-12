import type Usuario from '../models/Usuario'

/**
 * Valida um campo individual do formulário de cadastro
 * @param name - Nome do campo a ser validado
 * @param value - Valor do campo
 * @returns String com mensagem de erro ou string vazia se válido
 */
export function validarCampoCadastro(name: string, value: string): string {
	switch (name) {
		case "nome":
			if (!value.trim()) return "Nome completo é obrigatório"
			if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres"
			if (value.length > 100) return "Nome não pode exceder 100 caracteres"
			return ""

		case "usuario":
			if (!value.trim()) return "E-mail é obrigatório"
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(value)) return "E-mail inválido"
			return ""

		case "foto":
			if (!value.trim()) return "Foto (URL) é obrigatória"
			try {
				new URL(value)
			} catch {
				return "URL da foto inválida"
			}
			return ""

		case "senha":
			if (!value.trim()) return "Senha é obrigatória"
			if (value.length < 8) return "Senha deve ter no mínimo 8 caracteres"
			if (value.length > 50) return "Senha não pode exceder 50 caracteres"
			return ""

		case "confirmaSenha":
			if (!value.trim()) return "Confirmação de senha é obrigatória"
			if (value.length < 8) return "Confirmação deve ter no mínimo 8 caracteres"
			return ""

		default:
			return ""
	}
}

/**
 * Valida a correspondência entre senha e confirmação
 * @param senha - Senha do usuário
 * @param confirmaSenha - Confirmação da senha
 * @returns String com mensagem de erro ou string vazia se válido
 */
export function validarSenhasIguais(senha: string, confirmaSenha: string): string {
	if (senha !== confirmaSenha) return "As senhas não correspondem"
	return ""
}

/**
 * Valida todo o formulário de cadastro
 * @param usuario - Objeto usuário com os dados do formulário
 * @param confirmaSenha - Confirmação da senha
 * @returns Objeto com erros por campo (vazio se não houver erros)
 */
export function validarFormularioCadastro(usuario: Usuario, confirmaSenha: string): Record<string, string> {
	const erros: Record<string, string> = {}

	erros.nome = validarCampoCadastro("nome", usuario.nome || "")
	erros.usuario = validarCampoCadastro("usuario", usuario.usuario || "")
	erros.foto = validarCampoCadastro("foto", usuario.foto || "")
	erros.senha = validarCampoCadastro("senha", usuario.senha || "")
	erros.confirmaSenha = validarCampoCadastro("confirmaSenha", confirmaSenha)

	// Valida se as senhas correspondem
	if (!erros.senha && !erros.confirmaSenha) {
		erros.senhasIguais = validarSenhasIguais(usuario.senha, confirmaSenha)
	}

	// Remove campos sem erro
	Object.keys(erros).forEach(key => {
		if (erros[key] === "") delete erros[key]
	})

	return erros
}

/**
 * Verifica se o formulário tem algum erro
 * @param erros - Objeto com os erros do formulário
 * @returns true se não houver erros, false caso contrário
 */
export function formularioValido(erros: Record<string, string>): boolean {
	return Object.keys(erros).length === 0
}