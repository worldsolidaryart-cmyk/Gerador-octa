import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const clientsResponse = await supabase(`/rest/v1/profiles?select=id,email,display_name,role&order=email.asc`);
    if (!clientsResponse.ok) throw new Error('Não foi possível carregar os clientes.');
    return response.status(200).json({ clients: await clientsResponse.json() });
  } catch (error) {
    return safeError(response, error);
  }
}
