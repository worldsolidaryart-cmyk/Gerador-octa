import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const leadsResponse = await supabase(`/rest/v1/leads?select=*&order=created_at.desc`);
    if (!leadsResponse.ok) throw new Error('Não foi possível carregar os leads.');
    return response.status(200).json({ leads: await leadsResponse.json() });
  } catch (error) {
    return safeError(response, error);
  }
}
