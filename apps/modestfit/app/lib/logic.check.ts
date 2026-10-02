// ponytail: one runnable check for the non-trivial domain logic
// (modesty checker + hijab pairing + suggestion engine). No frameworks:
// plain asserts run with node. Compile: tsc this file + deps to /tmp,
// then run the emitted JS.
import { checkOutfit, meetsPrefs } from './modesty';
import { hijabScore } from './harmony';
import { generateSuggestions } from './suggest';
import {
  DEFAULT_PREFS,
  STARTER_CATALOG,
  type ModestyPrefs,
  type OwnedPiece,
} from '../data/pieces';

let failures = 0;
function ok(cond: boolean, name: string) {
  if (!cond) {
    failures += 1;
    console.error(`FAIL: ${name}`);
  } else {
    console.log(`ok: ${name}`);
  }
}

function owned(id: string): OwnedPiece {
  const def = STARTER_CATALOG.find((d) => d.id === id);
  if (!def) throw new Error(`missing starter piece ${id}`);
  return { ...def, id: `own_${id}`, wearCount: 0, addedAt: 0 };
}

// Catalogue spot-checks (attributes live in data/pieces.ts):
// s29 = White Long Tunic (long/maxi/opaque) — should PASS default prefs
// s31 = Black Long-Sleeve Top (long/KNEE/opaque) — fails minHem=midi
// s09 = Black Chiffon Hijab (semiSheer) — fails sheer=opaqueOnly
// s01 = Classic Black Abaya (long/floor/opaque) — passes
const prefs: ModestyPrefs = { ...DEFAULT_PREFS };
ok(meetsPrefs(owned('s29'), prefs), 'tunic passes default prefs');
ok(meetsPrefs(owned('s01'), prefs), 'abaya passes default prefs');
ok(!meetsPrefs(owned('s31'), prefs), 'knee-length top fails minHem=midi');
ok(!meetsPrefs(owned('s09'), prefs), 'semi-sheer hijab fails opaqueOnly');
ok(
  meetsPrefs(owned('s09'), { ...prefs, sheer: 'allowSemi' }),
  'semi-sheer hijab passes allowSemi',
);
ok(
  checkOutfit([owned('s29'), owned('s31')], prefs).length === 1,
  'outfit check reports exactly the failing piece',
);

// --- hijab pairing ---
ok(
  hijabScore('olive', ['olive']) > hijabScore('rose', ['olive']),
  'tonal olive-on-olive beats complementary rose-on-olive',
);
ok(
  hijabScore('black', ['rose']) > hijabScore('navy', ['rose']),
  'neutral black beats non-complement navy on rose base',
);

// --- suggestion engine ---
const wardrobe = [
  owned('s01'), // abaya, daily
  owned('s29'), // tunic top, daily
  owned('s24'), // black wide-leg trousers, daily
  owned('s10'), // ivory hijab, daily
  owned('s14'), // navy hijab, daily
];
const suggs = generateSuggestions(wardrobe, 'daily', prefs, 6);
ok(suggs.length > 0, 'suggestions generated from owned pieces');
ok(
  suggs.every((sg) => sg.baseIds.length >= 1 && sg.hijabId !== ''),
  'every suggestion has base pieces and a hijab',
);
ok(
  suggs.every(
    (sg) =>
      !sg.baseIds.includes(sg.hijabId) &&
      sg.baseIds.every((id) => {
        const pc = wardrobe.find((w) => w.id === id);
        return pc ? meetsPrefs(pc, prefs) : false;
      }),
  ),
  'suggestion bases meet modesty prefs and hijab is not a base',
);
ok(
  generateSuggestions(wardrobe.filter((w) => w.category !== 'hijab'), 'daily', prefs).length === 0,
  'no hijabs => no suggestions',
);

if (failures > 0) {
  throw new Error(`${failures} check(s) failed`);
}
console.log('all logic checks passed');
