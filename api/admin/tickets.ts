import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const { status, search } = request.body || {};
    let query = `/rest/v1/tickets?select=id,subject,category,status,description,created_at,updated_at,owner_id,assigned_admin,ticket_replies(id,author_role,message,created_at)&order=created_at.desc`;
    if (status) query += `&status=eq.${encodeURIComponent(status)}`;
    const ticketsResponse = await supabase(query);
    if (!ticketsResponse.ok) throw new Error('Não foi possível carregar os chamados.');
    const tickets = await ticketsResponse.json();

    const ownerIds = [...new Set(tickets.map((t: any) => t.owner_id))];
    let profilesById: Record<string, any> = {};
    if (ownerIds.length) {
      const profilesResponse = await supabase(`/rest/v1/profiles?id=in.(${ownerIds.join(',')})&select=id,email,display_name`);
      if (profilesResponse.ok) {
        for (const p of await profilesResponse.json()) profilesById[p.id] = p;
      }
    }
    let enriched = tickets.map((t: any) => ({ ...t, client: profilesById[t.owner_id] || null }));

    if (search) {
      const s = String(search).toLowerCase();
      enriched = enriched.filter((t: any) =>
        t.subject?.toLowerCase().includes(s) ||
        t.client?.email?.toLowerCase().includes(s) ||
        t.client?.display_name?.toLowerCase().includes(s)
      );
    }
    return response.status(200).json({ tickets: enriched });
  } catch (error) {
    return safeError(response, error);
  }
}
