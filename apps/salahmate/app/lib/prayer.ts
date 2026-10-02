import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

// On-device prayer-time calculation — no network needed, works offline.
// Default method is Muslim World League; the user can change it in Settings.
// Times should be verified against the local mosque (stated in the app).

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_ORDER: PrayerKey[] = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

/** The five trackable prayers (sunrise is shown but not tracked). */
export const TRACKED_PRAYERS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export interface CalcMethod {
  id: 'MWL' | 'Egyptian' | 'Karachi' | 'ISNA' | 'UmmAlQura' | 'Tehran';
  en: string;
  ar: string;
}

export const CALC_METHODS: CalcMethod[] = [
  { id: 'MWL', en: 'Muslim World League', ar: 'رابطة العالم الإسلامي' },
  { id: 'Egyptian', en: 'Egyptian General Authority', ar: 'الهيئة المصرية للمساحة' },
  { id: 'Karachi', en: 'Karachi (Hanafi)', ar: 'كراتشي (حنفي)' },
  { id: 'ISNA', en: 'ISNA (North America)', ar: 'إسنا (أمريكا الشمالية)' },
  { id: 'UmmAlQura', en: 'Umm al-Qura (Makkah)', ar: 'أم القرى (مكة)' },
  { id: 'Tehran', en: 'Tehran (Jafari)', ar: 'طهران (جعفري)' },
];

function paramsFor(methodId: CalcMethod['id']) {
  switch (methodId) {
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'ISNA':
      return CalculationMethod.NorthAmerica();
    case 'UmmAlQura':
      return CalculationMethod.UmmAlQura();
    case 'Tehran':
      return CalculationMethod.Tehran();
    case 'MWL':
    default:
      return CalculationMethod.MuslimWorldLeague();
  }
}

export type PrayerTimesMap = Record<PrayerKey, Date>;

export function getPrayerTimes(
  lat: number,
  lng: number,
  methodId: CalcMethod['id'],
  date: Date = new Date(),
): PrayerTimesMap {
  const coords = new Coordinates(lat, lng);
  const params = paramsFor(methodId);
  const pt = new PrayerTimes(coords, date, params);
  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
}

export interface NextPrayer {
  key: PrayerKey;
  time: Date;
  inMs: number;
}

/**
 * The next upcoming prayer across today and tomorrow's timetables
 * (sunrise included as a marker, not trackable). The caller passes both
 * days' times so the post-Isha countdown is exact.
 */
export function nextPrayer(
  today: PrayerTimesMap,
  tomorrow: PrayerTimesMap,
  now: Date = new Date(),
): NextPrayer {
  for (const key of PRAYER_ORDER) {
    if (today[key].getTime() > now.getTime()) {
      return { key, time: today[key], inMs: today[key].getTime() - now.getTime() };
    }
  }
  // After Isha: tomorrow's Fajr.
  return {
    key: 'fajr',
    time: tomorrow.fajr,
    inMs: tomorrow.fajr.getTime() - now.getTime(),
  };
}

export function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatCountdown(inMs: number): string {
  const totalMin = Math.max(0, Math.floor(inMs / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
