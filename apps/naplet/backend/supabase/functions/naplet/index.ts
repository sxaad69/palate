// Edge function `naplet`: family sync for baby events.
// The family_code is a short user-chosen code (not a secret); the table is
// keyed by it so every caregiver phone sees one timeline. Uses the
// service-role key; the client never touches the table directly.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';

interface ClientEvent {
  id: string;
  kind: 'sleep' | 'feed' | 'diaper';
  start: number;
  end?: number;
  feedType?: 'breast' | 'bottle' | 'solid';
  side?: 'left' | 'right' | 'both';
  amountMl?: number;
  diaperType?: 'wet' | 'dirty' | 'mixed';
  note?: string;
  updatedAt: number;
}

interface Payload {
  action: 'sync' | 'list';
  family_code: string;
  events?: ClientEvent[];
}

const CODE_RE = /^[A-Z0-9]{3,12}$/;
const KINDS = ['sleep', 'feed', 'diaper'];

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const payload = (await req.json()) as Payload;
    if (!payload.family_code || !CODE_RE.test(payload.family_code)) {
      return new Response('Invalid family_code', { status: 400 });
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
      const events = Array.isArray(payload.events) ? payload.events.slice(0, 2000) : [];
      for (const e of events) {
        if (!e.id || !KINDS.includes(e.kind) || typeof e.start !== 'number') continue;
        // Last-write-wins: only overwrite when the incoming copy is newer.
        const { data: cur } = await supabase
          .from('baby_events')
          .select('updated_at_ms')
          .eq('family_code', payload.family_code)
          .eq('event_id', e.id)
          .maybeSingle();
        if (cur && (cur.updated_at_ms as number) >= (e.updatedAt ?? 0)) continue;
        const { error } = await supabase.from('baby_events').upsert(
          {
            family_code: payload.family_code,
            event_id: e.id,
            kind: e.kind,
            start_ms: Math.floor(e.start),
            end_ms: e.end != null ? Math.floor(e.end) : null,
            feed_type: e.feedType ?? null,
            side: e.side ?? null,
            amount_ml: e.amountMl ?? null,
            diaper_type: e.diaperType ?? null,
            note: (e.note ?? '').slice(0, 500),
            updated_at_ms: Math.floor(e.updatedAt ?? 0),
          },
          { onConflict: 'family_code,event_id' },
        );
        if (error) throw error;
      }
      return json({ ok: true, synced: events.length });
    }

    if (payload.action === 'list') {
      const { data, error } = await supabase
        .from('baby_events')
        .select('*')
        .eq('family_code', payload.family_code)
        .order('start_ms', { ascending: false })
        .limit(5000);
      if (error) throw error;
      return json({
        events: (data ?? []).map((r) => ({
          id: r.event_id,
          kind: r.kind,
          start: Number(r.start_ms),
          end: r.end_ms != null ? Number(r.end_ms) : undefined,
          feedType: r.feed_type ?? undefined,
          side: r.side ?? undefined,
          amountMl: r.amount_ml ?? undefined,
          diaperType: r.diaper_type ?? undefined,
          note: r.note ?? undefined,
          updatedAt: Number(r.updated_at_ms),
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
