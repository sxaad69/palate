// Self-check for MeetBrief's pure logic (lib/format.ts + lib/summary.ts).
// Those two modules have zero runtime dependencies, so we compile them to
// a temp dir and assert against the compiled JS. No frameworks.
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const appDir = new URL('../app', import.meta.url).pathname;
const out = mkdtempSync(join(tmpdir(), 'mb-check-'));
try {
  execSync(
    `node ${join(appDir, 'node_modules/typescript/bin/tsc')} ` +
      `${join(appDir, 'lib/format.ts')} ${join(appDir, 'lib/summary.ts')} ` +
      `--outDir ${out} --module commonjs --target es2020 --skipLibCheck --esModuleInterop --jsx react-native`,
    { stdio: 'pipe' },
  );
  const { fmtDuration, fmtMoney, meetingCost } = await import(join(out, 'lib/format.js'));
  const { buildSummary } = await import(join(out, 'lib/summary.js'));

  assert.equal(fmtDuration(47), '0:47');
  assert.equal(fmtDuration(2873), '47:53');
  assert.equal(fmtDuration(3723), '1:02:03');
  assert.equal(fmtDuration(0), '0:00');

  assert.equal(meetingCost(100, 1800), 50);
  assert.equal(meetingCost(0, 1800), 0);
  assert.equal(meetingCost(60, 0), 0);
  assert.ok(fmtMoney(47.5, 'en').includes('47.50'));

  const base = {
    title: 'Weekly sync', createdAt: Date.now(), durationSec: 2820,
    hourlyRate: 80, cost: meetingCost(80, 2820), notes: 'Discussed launch.',
    transcript: '', actions: [
      { id: 'a1', text: 'Ship it', done: true, createdAt: 1 },
      { id: 'a2', text: 'Follow up', done: false, createdAt: 2 },
    ],
  };
  const en = buildSummary(base, 'en');
  assert.ok(en.includes('Weekly sync') && en.includes('47:00'));
  assert.ok(en.includes('2 total (1 done, 1 open)'));
  const ar = buildSummary(base, 'ar');
  assert.ok(ar.includes('Weekly sync') && ar.includes('1 منجزة'));

  const empty = buildSummary({ ...base, actions: [], notes: '  ', hourlyRate: 0, cost: 0 }, 'en');
  assert.ok(empty.includes('No action items yet'));
  assert.ok(!empty.includes('Estimated meeting cost'));

  console.log('selfcheck: all assertions passed');
} finally {
  rmSync(out, { recursive: true, force: true });
}
