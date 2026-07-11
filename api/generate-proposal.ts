import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/generative-ai'; // Verifique se o nome do seu import do Gemini é este

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Impede que pessoas usem métodos errados (aceita apenas POST)
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    // A Vercel já extrai o JSON enviado pelo seu formulário automaticamente aqui
    const data = request.body; 

    // IMPORTANTE: Use a variável de ambiente do processo para ler a chave do Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return response.status(500).json({ error: 'Chave do Gemini não configurada no servidor.' });
    }

    // --- COLOQUE SUA LÓGICA DO GEMINI AQUI ---
    // Exemplo genérico:
    // const ai = new GoogleGenAI({ apiKey });
    // const model = ai.getGenerativeModel({ model: "gemini-pro" });
    // const result = await model.generateContent(...);
    // const textoGerado = result.response.text();
    // ------------------------------------------

    // Retorna a resposta final de sucesso para a tela do usuário
    return response.status(200).json({ 
      success: true, 
      proposal: "Substitua isto pela variável com o texto gerado pelo Gemini" 
    });

  } catch (error: any) {
    // Se algo der errado na IA ou no código, avisa o front-end
    return response.status(500).json({ 
      error: 'Erro interno no servidor.', 
      details: error.message 
    });
  }
}
