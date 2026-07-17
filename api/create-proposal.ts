import type { VercelRequest, VercelResponse } from '@vercel/node';
import { proposalLoginEmail, proposalNumber, randomPassword, requirePost, safeError, sendMail, supabase } from './_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const { email, customerName, proposalContent, generatorKva, commercialModel, investment } = request.body || {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !proposalContent) {
    return response.status(400).json({ error: 'E-mail válido e proposta são obrigatórios.' });
  }

  try {
    const number = proposalNumber();
    const password = randomPassword();
    const loginEmail = proposalLoginEmail(number);
    const userResponse = await supabase('/auth/v1/admin/users', {
      method: 'POST', body: JSON.stringify({
        email: loginEmail, password, email_confirm: true,
        app_metadata: { role: 'client' }, user_metadata: { display_name: customerName || 'Cliente OCTA' },
      }),
    });
    const user = await userResponse.json();
    if (!userResponse.ok) throw new Error(user.message || 'Não foi possível criar o acesso do cliente.');

    const proposalResponse = await supabase('/rest/v1/proposals', {
      method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({
        proposal_number: number, owner_id: user.id, customer_email: email.toLowerCase(),
        customer_name: customerName || null, generator_kva: generatorKva || null,
        commercial_model: commercialModel || null, investment: investment || null, proposal_content: proposalContent,
      }),
    });
    if (!proposalResponse.ok) throw new Error('Não foi possível salvar a proposta.');

    await sendMail(email, `Sua proposta OCTA ${number}`, `
      <h2>Proposta OCTA Energy</h2>
      <p>Olá${customerName ? `, ${customerName}` : ''}. Sua proposta foi gerada e está disponível no Portal do Cliente.</p>
      <p><strong>Número da proposta (usuário):</strong> ${number}<br/>
      <strong>Senha temporária:</strong> ${password}</p>
      <p>Acesse <a href="https://gerador-octa.vercel.app/">o Portal do Cliente</a> e informe o número da proposta e a senha. Guarde esta senha em local seguro.</p>
    `);
    return response.status(201).json({ proposalNumber: number });
  } catch (error) {
    return safeError(response, error);
  }
}
