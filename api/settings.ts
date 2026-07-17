import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requirePost, requireAdmin, safeError, supabase } from './_portal.js';

const DEFAULTS: Record<string, number> = {
  bndes_annual_rate: 0.085,
  bndes_grace_months: 24,
  factory_discount_percent: 0,
  locacao_rent_percent: 50,
  locacao_commission_percent: 40,
  locacao_installment_percent: 100,
  bndes_min_revenue_multiplier: 2,
  bndes_min_years_founded: 2,
  bndes_min_documents: 2,
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requirePost(request, response)) return;
  try {
    const { action, updates } = request.body || {};

    if (action === 'update') {
      const adminId = await requireAdmin(request, response);
      if (!adminId) return;
      const entries = Object.entries(updates || {}).filter(([key]) => key in DEFAULTS);
      for (const [key, value] of entries) {
        const upsertResponse = await supabase('/rest/v1/platform_settings', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({ key, value }),
        });
        if (!upsertResponse.ok) throw new Error(`Não foi possível salvar "${key}".`);
      }
      return response.status(200).json({ ok: true });
    }

    const settingsResponse = await supabase('/rest/v1/platform_settings?select=key,value');
    if (!settingsResponse.ok) throw new Error('Não foi possível carregar as configurações.');
    const rows = await settingsResponse.json();
    const settings: Record<string, number> = { ...DEFAULTS };
    for (const row of rows) settings[row.key] = row.value;
    return response.status(200).json({ settings });
  } catch (error) {
    return safeError(response, error);
  }
}
