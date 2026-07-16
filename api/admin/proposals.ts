import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from '../_portal.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const adminId = await requireAdmin(request, response);
  if (!adminId) return;
  try {
    const { search } = request.body || {};
    const proposalsResponse = await supabase(`/rest/v1/proposals?select=id,proposal_number,customer_name,customer_email,generator_kva,commercial_model,investment,owner_id,created_at&order=created_at.desc`);
    if (!proposalsResponse.ok) throw new Error('Não foi possível carregar as propostas.');
    const proposals = await proposalsResponse.json();

    const ownerIds = [...new Set(proposals.map((p: any) => p.owner_id).filter(Boolean))];
    let profilesById: Record<string, any> = {};
    if (ownerIds.length) {
      const profilesResponse = await supabase(`/rest/v1/profiles?id=in.(${ownerIds.join(',')})&select=id,email,display_name`);
      if (profilesResponse.ok) {
        for (const p of await profilesResponse.json()) profilesById[p.id] = p;
      }
    }
    let enriched = proposals.map((p: any) => ({ ...p, client: p.owner_id ? profilesById[p.owner_id] || null : null }));

    if (search) {
      const s = String(search).toLowerCase();
      enriched = enriched.filter((p: any) =>
        p.proposal_number?.toLowerCase().includes(s) ||
        p.customer_name?.toLowerCase().includes(s) ||
        p.customer_email?.toLowerCase().includes(s) ||
        p.client?.email?.toLowerCase().includes(s)
      );
    }
    return response.status(200).json({ proposals: enriched });
  } catch (error) {
    return safeError(response, error);
  }
}
