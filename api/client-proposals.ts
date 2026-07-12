import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, safeError, supabase } from './_portal';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ error: 'Sessão ausente.' });
  try {
    const userResponse = await supabase('/auth/v1/user', { headers: { Authorization: `Bearer ${token}` } });
    const user = await userResponse.json();
    if (!userResponse.ok) return response.status(401).json({ error: 'Sessão inválida.' });
    const proposalsResponse = await supabase(`/rest/v1/proposals?owner_id=eq.${user.id}&select=proposal_number,customer_name,generator_kva,commercial_model,investment,proposal_content,created_at&order=created_at.desc`);
    if (!proposalsResponse.ok) throw new Error('Não foi possível carregar as propostas.');
    return response.status(200).json({ proposals: await proposalsResponse.json() });
  } catch (error) {
    return safeError(response, error);
  }
}
