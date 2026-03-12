import type Oportunidade from "./Oportunidade";

export default interface Usuario {
  id: number;
  nome: string;
  usuario: string;
  senha: string;
  foto: string;
  oportunidade?: Oportunidade | null;
}
