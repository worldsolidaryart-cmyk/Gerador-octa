import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

const STATUSES = ['aberto', 'em_atendimento', 'resolvido', 'cancelado'];

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const { ticketId, message, status } = request.body || {};
    if (!ticketId) return response.status(400).json({ error: 'Chamado não identificado.' });

    if (message) {
      const replyResponse = await supabase('/rest/v1/ticket_replies', {
        method: 'POST',
        body: JSON.stringify({ ticket_id: ticketId, author_role: 'admin', message }),
      });
      if (!replyResponse.ok) throw new Error('Não foi possível registrar a resposta.');
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString(), assigned_admin: adminId };
    if (status && STATUSES.includes(status)) patch.status = status;

    const updateResponse = await supabase(`/rest/v1/tickets?id=eq.${ticketId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    if (!updateResponse.ok) throw new Error('Não foi possível atualizar o chamado.');

    return response.status(200).json({ ok: true });
  } catch (error) {
    return safeError(response, error);
  }
}
