// Edge function `fernly`: backup/sync plants + care events per device.
// Uses the service-role key; the client never touches the tables directly.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';

interface ClientPlant {
  id: string;
  speciesId: string;
  nickname: string;
  adoptedAt: number;
  archived: boolean;
}

interface ClientEvent {
  id: string;
  plantId: string;
  type: 'water' | 'fertilize' | 'mist';
  at: number;
}

interface Payload {
  action: 'sync' | 'list';
  device_id: string;
  plants?: ClientPlant[];
  events?: ClientEvent[];
}

const TYPES = ['water', 'fertilize', 'mist'];

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
    const json = (body: unknown, status = 200) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });

    if (payload.action === 'sync') {
      for (const p of (payload.plants ?? []).slice(0, 500)) {
        if (!p.id || !p.speciesId) continue;
        const { error } = await supabase.from('plants').upsert(
          {
            device_id: payload.device_id,
            plant_id: p.id,
            species_id: p.speciesId,
            nickname: (p.nickname ?? '').slice(0, 120),
            adopted_at_ms: Math.floor(p.adoptedAt ?? 0),
            archived: p.archived === true,
          },
          { onConflict: 'device_id,plant_id' },
        );
        if (error) throw error;
      }
      for (const e of (payload.events ?? []).slice(0, 5000)) {
        if (!e.id || !e.plantId || !TYPES.includes(e.type) || typeof e.at !== 'number') continue;
        const { error } = await supabase.from('plant_events').upsert(
          {
            device_id: payload.device_id,
            event_id: e.id,
            plant_id: e.plantId,
            type: e.type,
            at_ms: Math.floor(e.at),
          },
          { onConflict: 'device_id,event_id' },
        );
        if (error) throw error;
      }
      return json({ ok: true });
    }

    if (payload.action === 'list') {
      const [plants, events] = await Promise.all([
        supabase.from('plants').select('*').eq('device_id', payload.device_id).limit(500),
        supabase
          .from('plant_events')
          .select('*')
          .eq('device_id', payload.device_id)
          .order('at_ms', { ascending: false })
          .limit(5000),
      ]);
      if (plants.error) throw plants.error;
      if (events.error) throw events.error;
      return json({
        plants: (plants.data ?? []).map((r) => ({
          id: r.plant_id,
          speciesId: r.species_id,
          nickname: r.nickname,
          adoptedAt: Number(r.adopted_at_ms),
          archived: r.archived,
        })),
        events: (events.data ?? []).map((r) => ({
          id: r.event_id,
          plantId: r.plant_id,
          type: r.type,
          at: Number(r.at_ms),
        })),
      });
    }

    return new Response('Unknown action', { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
