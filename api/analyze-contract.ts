import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { requireAdmin } from './_portal.js';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const adminId = await requireAdmin(request, response);
  if (!adminId) return;

  const { contractText } = request.body || {};

  try {
    if (!ai) {
      console.warn("Aviso: GEMINI_API_KEY não encontrada na Vercel. Usando parecer de contingência local.");
      return response.status(200).json({
        success: true,
        analysis: getFallbackAudit(contractText),
        note: 'fallback',
      });
    }

    const prompt = `Você é um agente de IA jurídica especializado em contratos de locação e financiamento de equipamentos industriais (geradores de energia) no Brasil.
Analise os parâmetros comerciais abaixo e produza um parecer de auditoria contratual em Markdown, cobrindo obrigatoriamente:
1. Cláusulas de carência pós-payback e eventuais bônus.
2. Multa rescisória e regras de devolução de valores caso o contrato seja encerrado antes do prazo total.
3. Conformidade com a LGPD quanto aos dados do cliente tratados no contrato.
4. Responsabilidades civis de engenharia (instalação, manutenção, operação do equipamento).

Parâmetros do contrato: ${JSON.stringify(contractText)}

Estruture a resposta com títulos claros para cada um dos 4 pontos acima.`;

    const aiResponse = await robustGenerateContent(ai, {
      contents: prompt,
      config: { temperature: 0.4 },
    });

    return response.status(200).json({
      success: true,
      analysis: aiResponse.text || aiResponse.response?.text || String(aiResponse),
    });
  } catch (error: any) {
    console.error("[Erro na API Vercel - analyze-contract]:", error);
    return response.status(200).json({
      success: true,
      analysis: getFallbackAudit(contractText),
      note: 'fallback',
    });
  }
}

async function robustGenerateContent(
  aiClient: GoogleGenAI,
  baseConfig: { contents: any; config?: any },
  modelsToTry = ["gemini-flash-latest", "gemini-2.5-flash"]
): Promise<any> {
  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const res = await aiClient.models.generateContent({
        model,
        contents: baseConfig.contents,
        config: baseConfig.config,
      });
      return res;
    } catch (error: any) {
      lastError = error;
    }
  }
  throw lastError || new Error("Falha ao gerar conteúdo.");
}

function getFallbackAudit(contractText: any): string {
  const isVenda = contractText?.selectedOption === "venda";
  const grace = contractText?.gracePeriod ?? contractText?.bndesParams?.graceMonths ?? 24;
  const rate = contractText?.bndesParams?.annualRate;

  return `### Parecer de Auditoria Contratual (Modo de Contingência Local)

#### 1. Carência pós-payback
O contrato prevê um período de carência de ${grace} meses${isVenda ? ", alinhado ao cronograma de financiamento BNDES" : ", aplicável ao início do faturamento de locação"}. Recomenda-se formalizar cláusula de bônus de 2 meses adicionais em caso de atraso na entrega do equipamento não imputável ao cliente.

#### 2. Multa rescisória e devolução de valores
Recomenda-se cláusula de multa rescisória proporcional ao tempo restante de contrato, com devolução de até 30% dos valores pagos antecipadamente caso a rescisão ocorra antes de 30 meses de vigência${rate ? ` (taxa de referência: ${(rate * 100).toFixed(1)}% a.a.)` : ""}.

#### 3. Conformidade com a LGPD
Os dados do cliente utilizados na elaboração deste contrato (identificação, dados de consumo energético e informações financeiras) devem ser tratados exclusivamente para a finalidade contratual, com base legal de execução de contrato (Art. 7º, V da LGPD), e descartados ao final do relacionamento comercial conforme política de retenção da OCTA Energia.

#### 4. Responsabilidades civis de engenharia
A instalação, comissionamento e manutenção preventiva do equipamento são de responsabilidade técnica da OCTA Energia ou parceiro homologado, cabendo ao cliente a manutenção da infraestrutura elétrica predial compatível com as especificações técnicas do gerador fornecido.

*Nota: parecer gerado em modo de segurança local — sem uso de IA generativa nesta análise.*`;
}
