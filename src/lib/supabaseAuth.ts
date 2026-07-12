const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const headers = () => ({
  apikey: key || '',
  'Content-Type': 'application/json',
});

export type PortalSession = { access_token: string; user: { id: string; email?: string } };

export function isSupabaseConfigured() {
  return Boolean(url && key);
}

export function proposalLoginEmail(proposalNumber: string) {
  return `proposal-${proposalNumber.trim().toLowerCase()}@portal.octa.local`;
}

export async function signInPortal(login: string, password: string): Promise<PortalSession> {
  if (!isSupabaseConfigured()) throw new Error('Supabase ainda não foi configurado.');
  const email = login.includes('@') ? login.trim().toLowerCase() : proposalLoginEmail(login);
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error('Usuário ou senha inválidos.');
  return data;
}

export async function signUpPortal(email: string, password: string, displayName: string) {
  if (!isSupabaseConfigured()) throw new Error('Supabase ainda não foi configurado.');
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ email, password, data: { display_name: displayName } }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || 'Não foi possível criar o acesso.');
  return data;
}

export async function requestPasswordReset(login: string) {
  const response = await fetch('/api/request-password-reset', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login }),
  });
  if (!response.ok) throw new Error('Não foi possível solicitar a redefinição.');
}
