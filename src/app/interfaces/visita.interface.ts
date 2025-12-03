import { Visitante } from "./visitante.interface";

export interface Visita {
  id: string;
  visitante: Visitante;   // 👈 agora é um objeto
  localDestino: string;
  tipoVisita: string;
  dataEntrada: string | null;
  dataSaida: string | null;
  motivo: string;
  observacoes: string;
  status: string;
  crachaNumero: string;
  crachaTemporario: boolean;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitasMetrics {
  visitasHoje: number;
  totalDoMes: number;
  saidasHoje: number;
}