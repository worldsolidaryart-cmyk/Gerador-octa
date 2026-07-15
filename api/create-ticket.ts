import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, safeError, supabase } from './_portal.js';

const CATEGORIES = ['manutenção', 'financeiro', 'técnico', 'outros'];

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ error: 'Sessão ausente.' });
  try {
    const userResponse = await supabase('/auth/v1/user', { headers: { Authorization: `Bearer ${token}` } });
    const user = await userResponse.json();
    if (!userResponse.ok) return response.status(401).json({ error: 'Sessão inválida.' });

    const { subject, description, category } = request.body || {};
    if (!subject || !description) return response.status(400).json({ error: 'Preencha assunto e descrição.' });
    const safeCategory = CATEGORIES.includes(category) ? category : 'outros';

    const insertResponse = await supabase('/rest/v1/tickets', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ owner_id: user.id, subject, description, category: safeCategory }),
    });
    if (!insertResponse.ok) throw new Error('Não foi possível abrir o chamado.');
    const [ticket] = await insertResponse.json();
    return response.status(200).json({ ticket });
  } catch (error) {
    return safeError(response, error);
  }
}
