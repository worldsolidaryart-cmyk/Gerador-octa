import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

const STAGES = ['leads', 'proposal', 'negotiation', 'closed', 'implantação'];

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const { action, leadId, stage, name, company, phone, email, billValue, assignedAgent } = request.body || {};

    if (action === 'create') {
      if (!name) return response.status(400).json({ error: 'Informe ao menos o nome do lead.' });
      const insertResponse = await supabase('/rest/v1/leads', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ name, company, phone, email, bill_value: billValue || null, assigned_agent: assignedAgent || null }),
      });
      if (!insertResponse.ok) throw new Error('Não foi possível criar o lead.');
      const [lead] = await insertResponse.json();
      return response.status(200).json({ lead });
    }

    if (action === 'update') {
      if (!leadId || !STAGES.includes(stage)) return response.status(400).json({ error: 'Dados inválidos.' });
      const updateResponse = await supabase(`/rest/v1/leads?id=eq.${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify({ stage, updated_at: new Date().toISOString() }),
      });
      if (!updateResponse.ok) throw new Error('Não foi possível atualizar o lead.');
      return response.status(200).json({ ok: true });
    }

    const leadsResponse = await supabase(`/rest/v1/leads?select=*&order=created_at.desc`);
    if (!leadsResponse.ok) throw new Error('Não foi possível carregar os leads.');
    return response.status(200).json({ leads: await leadsResponse.json() });
  } catch (error) {
    return safeError(response, error);
  }
}
