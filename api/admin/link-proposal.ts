import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const { proposalId, clientId } = request.body || {};
    if (!proposalId) return response.status(400).json({ error: 'Proposta não identificada.' });

    const updateResponse = await supabase(`/rest/v1/proposals?id=eq.${proposalId}`, {
      method: 'PATCH',
      body: JSON.stringify({ owner_id: clientId || null }),
    });
    if (!updateResponse.ok) throw new Error('Não foi possível atualizar a vinculação.');

    return response.status(200).json({ ok: true });
  } catch (error) {
    return safeError(response, error);
  }
}
