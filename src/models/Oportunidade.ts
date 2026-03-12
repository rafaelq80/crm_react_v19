import type Cliente from "./Cliente"
import type Usuario from "./Usuario"

export default interface Oportunidade{
    id : number
    descricao : string
    valor: number
    dataAbertura: string
    dataFechamento: string
    status: number
    cliente: Cliente;
    usuario: Usuario;
}