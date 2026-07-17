import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const { name, company, phone, email, billValue, assignedAgent } = request.body || {};
    if (!name) return response.status(400).json({ error: 'Informe ao menos o nome do lead.' });

    const insertResponse = await supabase('/rest/v1/leads', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        name, company, phone, email,
        bill_value: billValue || null,
        assigned_agent: assignedAgent || null,
      }),
    });
    if (!insertResponse.ok) throw new Error('Não foi possível criar o lead.');
    const [lead] = await insertResponse.json();
    return response.status(200).json({ lead });
  } catch (error) {
    return safeError(response, error);
  }
}
