import type Oportunidade from "./Oportunidade"

export default interface Cliente{
    id : number
    cnpj: string
    nome : string
    email : string
    telefone: string
    foto: string
    historico : string
    oportunidade?: Oportunidade | null;
}