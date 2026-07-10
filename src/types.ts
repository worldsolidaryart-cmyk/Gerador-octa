export interface ElectricityBill {
  clientName: string;
  consumoKwh: number;
  tarifa: number;
  valorConta: number;
  demanda?: number;
  icms?: number;
  pis?: number;
  cofins?: number;
  bandeira?: string;
  historico?: Array<{
    mes: string;
    consumo: number;
    valor: number;
  }>;
}

export interface GeneratorModel {
  capacityKva: number;
  powerKw: number; // calculated as KVA * 0.8
  vendaPrice: number;
  locacaoRefPrice: number;
  generationKwh: number; // capacityKva * 0.8 * 24 * 30 * 0.90
  name?: string;
  description?: string;
  segment?: string;
  voltagem?: string;
  frequencia?: string;
  area?: string;
  rendimento?: string;
  highlights?: string[];
  imageUrl?: string;
}

export interface BndesSimulation {
  financedAmount: number;
  downPayment: number;
  interestRateAnnual: number;
  termMonths: number;
  gracePeriodMonths: number;
}

export interface FinanceAnalysis {
  investment: number;
  monthlySavings: number;
  clientPayment: number;
  paybackSimple: number;
  paybackDiscounted: number;
  gargantuaGracePeriod: number; // paybackSimple + 2 bônus
  totalRevenue60Months: number;
  totalProfit60Months: number;
  vpl: number;
  tir: number;
  roi: number;
  ebitda: number;
  commission: number; // 6% on the Locação Reference Price paid to agent
  bndesSimulation?: {
    monthlyPayment: number;
    totalInterest: number;
    amortizationSchedule: Array<{
      month: number;
      payment: number;
      amortization: number;
      interest: number;
      balance: number;
    }>;
  };
}

export interface CRMLead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  billValue: number;
  stage: "leads" | "proposal" | "negotiation" | "closed" | "implantação";
  assignedAgent: string;
  createdAt: string;
}

export interface CRMContract {
  id: string;
  leadId: string;
  clientName: string;
  generatorKva: number;
  type: "VENDA" | "LOCACAO" | "FINANCIAMENTO";
  value: number;
  monthlyFee: number;
  startDate: string;
  endDate: string;
  status: "Aguardando Assinaturas" | "Assinado" | "Ativo" | "Encerrado";
  gracePeriodMonths: number;
  commissionPaid: boolean;
  version: number;
}

export interface CustomerTicket {
  id: string;
  subject: string;
  category: "manutenção" | "financeiro" | "técnico" | "outros";
  status: "aberto" | "em_atendimento" | "resolvido";
  createdAt: string;
  description: string;
}
