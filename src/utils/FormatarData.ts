import { addHours, format, intervalToDuration, parseISO, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Constante para o fuso horário de São Paulo (GMT-3)
const FUSO_HORARIO_BR = 3;

/**
 * Formata uma data ISO para o padrão brasileiro (dd/MM/yyyy)
 * @param dataISO - Data em formato ISO ou undefined
 * @returns Data formatada no padrão brasileiro ou string vazia em caso de erro
 */
export const formatarData = (dataISO: string | undefined): string => {
  if (!dataISO) return '';
  
  try {
    const dataObjeto = parseISO(dataISO);
    return format(dataObjeto, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return '';
  }
};

/**
 * Formata uma data ISO para hora (HH:mm) com ajuste de fuso horário
 * Adiciona 3 horas para compensar a diferença do fuso horário de São Paulo
 * @param dataISO - Data em formato ISO ou undefined
 * @returns Hora formatada (HH:mm) ou string vazia em caso de erro
 */
export const formatarHora = (dataISO: string | undefined): string => {
  if (!dataISO) return '';
  
  try {
    const dataObjeto = parseISO(dataISO);
    const dataComFusoHorario = addHours(dataObjeto, FUSO_HORARIO_BR);
    return format(dataComFusoHorario, 'HH:mm', { locale: ptBR });
  } catch {
    return '';
  }
};

/**
 * Formata uma data ISO para hora (HH:mm) sem ajuste de fuso horário
 * Útil para dados vindos de backends Java que já ajustam o fuso internamente
 * @param dataISO - Data em formato ISO ou undefined
 * @returns Hora formatada (HH:mm) ou string vazia em caso de erro
 */
export const formatarHoraJava = (dataISO: string | undefined): string => {
  if (!dataISO) return '';
  
  try {
    const dataObjeto = parseISO(dataISO);
    return format(dataObjeto, 'HH:mm', { locale: ptBR });
  } catch {
    return '';
  }
};

/**
 * Formata uma data ISO para formato completo (dd/MM/yyyy HH:mm)
 * Sem ajuste de fuso horário, pois parseISO já interpreta corretamente
 * @param dataISO - Data em formato ISO ou undefined
 * @returns Data e hora formatadas ou string vazia em caso de erro
 */
export const formatarDataCompleta = (dataISO: string | undefined): string => {
  if (!dataISO) return '';
  
  try {
    const dataObjeto = parseISO(dataISO);
    return format(dataObjeto, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (erro) {
    console.error('Erro ao formatar data completa:', erro);
    return '';
  }
};

/**
 * Formata uma data para ser carregada em um input datetime-local
 * O input datetime-local interpreta automaticamente como horário local
 * @param dataISO - Data em formato ISO ou undefined
 * @returns Data formatada para input (yyyy-MM-dd'T'HH:mm) ou string vazia em caso de erro
 */
export const formatarDataInputDateTime = (dataISO: string | undefined): string => {
  if (!dataISO) return '';
  
  try {
    // Se já está no formato correto, retorna apenas a parte antes do ponto
    if (dataISO.includes('T')) {
      const [dataFormatada] = dataISO.split('.');
      return dataFormatada;
    }
    
    // Converte para o formato esperado pelo input
    const dataObjeto = parseISO(dataISO);
    return format(dataObjeto, "yyyy-MM-dd'T'HH:mm");
  } catch (erro) {
    console.error('Erro ao formatar data para input:', erro);
    return '';
  }
};

/**
 * Formata a data recebida de um input datetime-local para enviar ao backend
 * Ajusta o fuso horário e converte para formato ISO
 * @param dataLocal - Data do input datetime-local
 * @param foiAlterada - Indica se o usuário modificou a data original
 * @returns Data em formato ISO com ajuste de fuso horário ou string vazia em caso de erro
 */
export const formatarDataSubmit = (dataLocal: string, foiAlterada: boolean): string => {
  if (!dataLocal) return '';
  
  try {
    // Se não foi alterada, retorna a data original
    if (!foiAlterada) {
      return dataLocal;
    }

    // Converte para objeto Date e ajusta o fuso horário
    const dataEmObjeto = new Date(dataLocal);
    const dataAjustadaComFuso = subHours(dataEmObjeto, FUSO_HORARIO_BR);

    return dataAjustadaComFuso.toISOString();
  } catch (erro) {
    console.error('Erro ao formatar data para envio:', erro);
    return '';
  }
};

/**
 * Formata a data recebida de um input datetime-local para enviar ao backend Java
 * Similar a formatarDataSubmit, mas remove o 'T' do formato ISO
 * @param dataLocal - Data do input datetime-local
 * @param foiAlterada - Indica se o usuário modificou a data original
 * @returns Data no formato Java (yyyy-MM-dd HH:mm:ss) ou string vazia em caso de erro
 */
export const formatarDataSubmitJava = (dataLocal: string, foiAlterada: boolean): string => {
  if (!dataLocal) return '';
 
  try {
    // Se não foi alterada, retorna a data original
    if (!foiAlterada) {
      return dataLocal;
    }

    // Converte para objeto Date e ajusta o fuso horário
    const dataEmObjeto = new Date(dataLocal);
    const dataAjustadaComFuso = subHours(dataEmObjeto, FUSO_HORARIO_BR);
    
    // Remove o 'T' e a parte de milissegundos
    const dataFormatadaJava = dataAjustadaComFuso.toISOString()
      .replace('T', ' ')
      .split('.')[0];
    
    return dataFormatadaJava;
  } catch (erro) {
    console.error('Erro ao formatar data para envio Java:', erro);
    return '';
  }
};

/**
 * Converte minutos em uma string legível (ex: "2 horas e 30 minutos")
 * @param minutos - Quantidade de minutos a converter
 * @returns String formatada com horas e minutos em português
 */
export const conversorHoras = (minutos: number): string => {
  const duracao = intervalToDuration({
    start: 0, 
    end: minutos * 60000, // Converte minutos para milissegundos
  });

  if (!duracao) {
    return `${minutos} minuto${minutos > 1 ? 's' : ''}`;
  }

  // Formata as horas (ex: "2 horas")
  const textoHoras = duracao.hours && duracao.hours > 0 
    ? `${duracao.hours} hora${duracao.hours > 1 ? 's' : ''}` 
    : '';
  
  // Formata os minutos (ex: "30 minutos")
  const textoMinutos = `${duracao.minutes} minuto${duracao.minutes && duracao.minutes > 1 ? 's' : ''}`;

  // Retorna horas + minutos ou apenas minutos
  return textoHoras ? `${textoHoras} e ${textoMinutos}` : textoMinutos;
};