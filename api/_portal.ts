import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'node:crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function configured() {
  return Boolean(supabaseUrl && serviceRole);
}

export async function supabase(path: string, init: RequestInit = {}) {
  if (!configured()) throw new Error('Integração Supabase não configurada.');
  return fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: serviceRole!, Authorization: `Bearer ${serviceRole!}`,
      'Content-Type': 'application/json', ...(init.headers || {}),
    },
  });
}

export function proposalLoginEmail(number: string) {
  return `proposal-${number.toLowerCase()}@portal.octa.local`;
}

export function randomPassword() {
  // 20 caracteres criptograficamente aleatórios: não reutilizável na prática.
  return randomBytes(18).toString('base64url');
}

export function proposalNumber() {
  return `OCTA-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function sendMail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error('E-mail transacional não configurado.');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Resend error:', response.status, errorBody);
    throw new Error('Não foi possível enviar o e-mail.');
  }
}
export function safeError(response: VercelResponse, error: unknown) {
  console.error(error);
  return response.status(500).json({ error: error instanceof Error ? error.message : 'Erro interno.' });
}

export function requirePost(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Método não permitido.' });
    return false;
  }
  return true;
}

export async function requireAdmin(request: VercelRequest, response: VercelResponse): Promise<string | null> {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) { response.status(401).json({ error: 'Sessão ausente.' }); return null; }
  const userResponse = await supabase('/auth/v1/user', { headers: { Authorization: `Bearer ${token}` } });
  const user = await userResponse.json();
  if (!userResponse.ok) { response.status(401).json({ error: 'Sessão inválida.' }); return null; }
  const profileResponse = await supabase(`/rest/v1/profiles?id=eq.${user.id}&select=role`);
  const profile = await profileResponse.json();
  if (!profileResponse.ok || !profile?.[0] || profile[0].role !== 'admin') {
    response.status(403).json({ error: 'Acesso restrito a administradores.' });
    return null;
  }
  return user.id;
}
