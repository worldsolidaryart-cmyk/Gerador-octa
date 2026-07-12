import type { VercelRequest, VercelResponse } from '@vercel/node';
import { proposalLoginEmail, requirePost, safeError, sendMail, supabase } from './_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const login = String(request.body?.login || '').trim();
  if (!login) return response.status(400).json({ error: 'Informe o e-mail ou número da proposta.' });
  try {
    const isProposal = !login.includes('@');
    const authEmail = isProposal ? proposalLoginEmail(login) : login.toLowerCase();
    let destination = authEmail;
    if (isProposal) {
      const proposalResponse = await supabase(`/rest/v1/proposals?proposal_number=eq.${encodeURIComponent(login)}&select=customer_email`);
      const proposal = await proposalResponse.json();
      if (!proposalResponse.ok || !proposal[0]) return response.status(200).json({ ok: true });
      destination = proposal[0].customer_email;
    }
    const linkResponse = await supabase('/auth/v1/admin/generate_link', {
      method: 'POST', body: JSON.stringify({ type: 'recovery', email: authEmail }),
    });
    const link = await linkResponse.json();
    if (!linkResponse.ok) throw new Error('Não foi possível gerar o link de redefinição.');
    await sendMail(destination, 'Redefina sua senha do Portal OCTA', `<p>Para criar uma nova senha, <a href="${link.action_link}">acesse este link seguro</a>.</p>`);
    return response.status(200).json({ ok: true });
  } catch (error) {
    return safeError(response, error);
  }
}
