import type Oportunidade from "../models/Oportunidade"

/**
 * Valida um campo individual do formulário de oportunidade
 * @param name - Nome do campo a ser validado
 * @param value - Valor do campo
 * @returns String com mensagem de erro ou string vazia se válido
 */
export function validarCampoOportunidade(name: string, value: string): string {
	switch (name) {
		case "descricao":
			if (!value.trim()) return "Descrição da oportunidade é obrigatório"
			if (value.length < 5) return "Descrição deve ter pelo menos 5 caracteres"
			if (value.length > 255) return "Descrição não pode exceder 255 caracteres"
			return ""

		case "valor":
			if (!value.trim()) return "Valor é obrigatório"
			const valor = parseFloat(value)
			if (isNaN(valor)) return "Valor deve ser um número válido"
			if (valor <= 0) return "Valor deve ser maior que zero"
			return ""

		case "dataFechamento":
			if (!value.trim()) return "Data de fechamento é obrigatória"

			const data = new Date(value)
			if (isNaN(data.getTime())) return "Data inválida"

			// Validação: data deve ser presente ou futura
			const hoje = new Date()
			hoje.setHours(0, 0, 0, 0) // Zera horas para comparar apenas a data

			const dataFechamento = new Date(value)
			dataFechamento.setHours(0, 0, 0, 0)

			if (dataFechamento < hoje) {
				return "A data de fechamento deve ser hoje ou uma data futura"
			}

			return ""

		case "status":
			if (!value || value === "0" || value === "") return "Status é obrigatório"
			const statusNum = parseInt(value)
			if (isNaN(statusNum) || statusNum < 1 || statusNum > 3) return "Status inválido"
			return ""

		case "cliente":
			if (!value || value === "0") return "Cliente é obrigatório"
			return ""

		default:
			return ""
	}
}

/**
 * Valida todo o formulário de oportunidade
 * @param oportunidade - Objeto oportunidade com os dados do formulário
 * @returns Objeto com erros por campo (vazio se não houver erros)
 */
export function validarFormularioOportunidade(oportunidade: Oportunidade): Record<string, string> {
	const erros: Record<string, string> = {}

	erros.descricao = validarCampoOportunidade("nome", oportunidade.descricao || "")
	erros.valor = validarCampoOportunidade("valor", oportunidade.valor?.toString() || "")
	erros.dataFechamento = validarCampoOportunidade(
		"dataFechamento",
		oportunidade.dataFechamento || "",
	)
	erros.status = validarCampoOportunidade("status", oportunidade.status?.toString() || "")
	erros.cliente = validarCampoOportunidade("cliente", oportunidade.cliente?.id?.toString() || "")

	// Remove campos sem erro
	Object.keys(erros).forEach((key) => {
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
