// Edge function `habits`: log + list habit events for a device.
// Uses the service-role key; the client never touches the table directly.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';

interface Payload {
  action: 'log' | 'list';
  device_id: string;
  event?: { recipeId: string; date: string; kind: 'completed' | 'shrunk' };
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const payload = (await req.json()) as Payload;
    if (!payload.device_id || typeof payload.device_id !== 'string') {
      return new Response('Missing device_id', { status: 400 });
    }

    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(url, serviceKey);

    if (payload.action === 'log') {
      const ev = payload.event;
      if (!ev?.recipeId || !ev?.date || !ev?.kind) {
        return new Response('Missing event fields', { status: 400 });
      }
      const { error } = await supabase.from('habit_events').upsert(
        {
          device_id: payload.device_id,
          recipe_id: ev.recipeId,
          event_date: ev.date,
          kind: ev.kind,
        },
        { onConflict: 'device_id,recipe_id,event_date,kind' },
      );
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (payload.action === 'list') {
      const { data, error } = await supabase
        .from('habit_events')
        .select('recipe_id, event_date')
        .eq('device_id', payload.device_id)
        .order('event_date', { ascending: false })
        .limit(5000);
      if (error) throw error;
      return new Response(
        JSON.stringify({
          events: (data ?? []).map((r) => ({ recipeId: r.recipe_id, date: r.event_date })),
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response('Unknown action', { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
