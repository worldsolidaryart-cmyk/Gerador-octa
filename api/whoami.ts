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
    const profileResponse = await supabase(`/rest/v1/profiles?id=eq.${user.id}&select=role,display_name`);
    const profile = await profileResponse.json();
    return response.status(200).json({ role: profile?.[0]?.role || 'client', displayName: profile?.[0]?.display_name || null });
  } catch (error) {
    return safeError(response, error);
  }
}
