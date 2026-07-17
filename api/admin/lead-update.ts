import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

const STAGES = ['leads', 'proposal', 'negotiation', 'closed', 'implantação'];

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const { leadId, stage } = request.body || {};
    if (!leadId || !STAGES.includes(stage)) return response.status(400).json({ error: 'Dados inválidos.' });

    const updateResponse = await supabase(`/rest/v1/leads?id=eq.${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, updated_at: new Date().toISOString() }),
    });
    if (!updateResponse.ok) throw new Error('Não foi possível atualizar o lead.');
    return response.status(200).json({ ok: true });
  } catch (error) {
    return safeError(response, error);
  }
}
