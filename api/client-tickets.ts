import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, safeError, supabase } from './_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ error: 'Sessão ausente.' });
  try {
    const userResponse = await supabase('/auth/v1/user', { headers: { Authorization: `Bearer ${token}` } });
    const user = await userResponse.json();
    if (!userResponse.ok) return response.status(401).json({ error: 'Sessão inválida.' });
    const ticketsResponse = await supabase(`/rest/v1/tickets?owner_id=eq.${user.id}&select=id,subject,category,status,description,created_at,updated_at,ticket_replies(id,author_role,message,created_at)&order=created_at.desc`);
    if (!ticketsResponse.ok) throw new Error('Não foi possível carregar os chamados.');
    return response.status(200).json({ tickets: await ticketsResponse.json() });
  } catch (error) {
    return safeError(response, error);
  }
}
