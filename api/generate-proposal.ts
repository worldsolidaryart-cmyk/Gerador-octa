import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

// Inicializa a API do Gemini fora da função para economizar memória (Serverless Cold Start)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // 1. Permite apenas requisições POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  // 2. Extrai os dados enviados pelo Front-end do formulário
  const { clientData, generatorData, financeData, selectedOption } = request.body;

  try {
    // Se a chave não existir na Vercel, dispara o Fallback (Modo simulação inteligente)
    if (!ai) {
      console.warn("Aviso: GEMINI_API_KEY não encontrada na Vercel. Usando simulação inteligente.");
      const fallbackHtml = getFallbackProposal(clientData, generatorData, financeData, selectedOption);
      return response.status(200).json({ text: fallbackHtml });
    }

    // 3. Montagem do Prompt enviado para o Gemini (Mesmo padrão do seu app original)
    const prompt = `Gere uma proposta comercial detalhada e muito bem estruturada em Markdown para a empresa OCTA ENERGIA.
    Dados do Cliente: ${JSON.stringify(clientData)}
    Especificações Técnicas: ${JSON.stringify(generatorData)}
    Modelo Comercial Selecionado: ${selectedOption === 'venda' ? 'Venda Direta / Financiamento BNDES' : 'Locação Estruturada'}
    Informações Econômicas: ${JSON.stringify(financeData)}
    
    A proposta deve conter Introdução, Especificações do Equipamento, Cronograma de 90 dias, e os dados de investimento/custos formatados claramente.`;

    // 4. Executa a função robusta de geração (Fila de redundância)
    const aiResponse = await robustGenerateContent(ai, {
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    // 5. Retorna o texto gerado pela Inteligência Artificial para o seu front-end
    return response.status(200).json({ text: aiResponse.text || aiResponse.response?.text || String(aiResponse) });

  } catch (error: any) {
    console.error("[Erro na API Vercel]:", error);
    
    // Se a API do Gemini falhar completamente no servidor, ativa o Fallback local para não quebrar a tela do usuário
    const fallbackHtml = getFallbackProposal(clientData, generatorData, financeData, selectedOption);
    return response.status(200).json({ text: fallbackHtml, isFallback: true });
  }
}

// =========================================================================
// FUNÇÕES AUXILIARES INDISPENSÁVEIS (Mantendo toda a sua lógica de redundância)
// =========================================================================

async function robustGenerateContent(
  aiClient: GoogleGenAI, 
  baseConfig: { contents: any; config?: any }, 
  modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"] // Atualizado para modelos compatíveis
): Promise<any> {
  let lastError: any = null;
  for (const model of modelsToTry) {
    let retries = 1;
    let delay = 800;
    while (retries >= 0) {
      try {
        const fullParams = {
          model: model,
          contents: baseConfig.contents,
          config: baseConfig.config
        };
        const res = await aiClient.models.generateContent(fullParams);
        return res;
      } catch (error: any) {
        lastError = error;
        break; 
      }
    }
  }
  throw lastError || new Error("Falha ao gerar conteúdo.");
}

function getFallbackProposal(clientData: any, generatorData: any, financeData: any, selectedOption: any): string {
  const isVenda = selectedOption === "venda";
  const lp = financeData?.locacaoParams || { rentPercent: 50, bonusMonths: 2, contractMonths: 60, commissionPercent: 6, installmentPercent: 50 };
  const bp = financeData?.bndesParams || { downPayment: 340000, annualRate: 0.085, termMonths: 60, graceMonths: 24 };

  const formattedPrice = Number(generatorData?.price || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedInvestment = Number(financeData?.investment || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedSavings = Number(financeData?.monthlySavings || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedClientPayment = Number(financeData?.clientPayment || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const discountPercent = financeData?.factoryDiscountPercent || 0;

  let modelDetailsSection = "";

  if (isVenda) {
    const loanAmount = Math.max(0, (financeData?.investment || 0) - bp.downPayment);
    modelDetailsSection = `#### 3. ANÁLISE ECONÔMICO-FINANCEIRA (VENDA DIRETA / FINANCIAMENTO)
*   **Investimento Total:** R$ ${formattedInvestment}
*   **Desconto de Fábrica Aplicado:** ${discountPercent}%
*   **Aporte de Entrada Solicitado:** R$ ${Number(bp.downPayment).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
*   **Saldo Financiável Estimado (BNDES):** R$ ${loanAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
*   **Taxa de Juros de Referência:** ${(bp.annualRate * 100).toFixed(1)}% a.a.
*   **Prazo Total de Financiamento:** ${bp.termMonths} meses (com ${bp.graceMonths} meses de carência)
*   **Economia de Energia Gerada (Estimada):** R$ ${formattedSavings}/mês`;
  } else {
    modelDetailsSection = `#### 3. ANÁLISE ECONÔMICO-FINANCEIRA (LOCAÇÃO ESTRUTURADA)
*   **Valor de Referência do Ativo:** R$ ${formattedPrice}
*   **Desconto de Fábrica Aplicado:** ${discountPercent}%
*   **Custo de Locação de Referência (com Desconto):** R$ ${formattedInvestment}
*   **Aluguel Mensal pós-Carência:** R$ ${formattedClientPayment}/mês (equivalente a ${lp.rentPercent}% da conta base original)
*   **Duração do Faturamento de Locação:** ${lp.contractMonths} meses`;
  }

  return `### PROPOSTA TÉCNICO-COMERCIAL - OCTA ENERGIA
**Cliente:** ${clientData?.clientName || "Cliente"}
**Gerador Recomendado:** Gerador Cinético Ecológico de ${generatorData?.capacityKva || 150} KVA

${modelDetailsSection}

*Nota: Proposta gerada em modo de segurança local estruturada.*`;
}
