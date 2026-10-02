// Edge function: fasts — log + list fasts for a device.
// Service-role client: callers pass device_id in the body; there is no
// user auth (same trust model as Palate's meals function).
// Deploy: supabase functions deploy fasts --project-ref <ref>

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FastInput {
  startedAt: number;
  endedAt: number;
  targetHours: number;
  presetId: string;
  completed: boolean;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: 'server misconfigured' }, 500);
  }

  let body: { action?: string; device_id?: string; fast?: FastInput };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }

  const deviceId = typeof body.device_id === 'string' ? body.device_id.slice(0, 128) : '';
  if (!deviceId) return json({ error: 'device_id required' }, 400);

  const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  if (body.action === 'log') {
    const f = body.fast;
    if (!f || typeof f.startedAt !== 'number' || typeof f.endedAt !== 'number') {
      return json({ error: 'fast required' }, 400);
    }
    const { data, error } = await db
      .from('fasts')
      .insert({
        device_id: deviceId,
        started_at: new Date(f.startedAt).toISOString(),
        ended_at: new Date(f.endedAt).toISOString(),
        target_hours: f.targetHours,
        preset_id: String(f.presetId).slice(0, 64),
        completed: f.completed === true,
      })
      .select('id')
      .single();
    if (error) return json({ error: 'db error' }, 500);
    return json({ id: data.id });
  }

  if (body.action === 'list') {
    const { data, error } = await db
      .from('fasts')
      .select('id, started_at, ended_at, target_hours, preset_id, completed')
      .eq('device_id', deviceId)
      .order('started_at', { ascending: false })
      .limit(500);
    if (error) return json({ error: 'db error' }, 500);
    return json({
      fasts: (data ?? []).map((r) => ({
        id: r.id,
        startedAt: new Date(r.started_at).getTime(),
        endedAt: new Date(r.ended_at).getTime(),
        targetHours: Number(r.target_hours),
        presetId: r.preset_id,
        completed: r.completed,
      })),
    });
  }

  return json({ error: 'unknown action' }, 400);
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
