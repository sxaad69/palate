export interface SeedLook {
  id: string;
  stylistName: string;
  district: string;
  city: string;
  country: string;
  lookTitle: string;
  avatarKey: 'sand' | 'black' | 'olive';
  tones: string[];
  votes: number;
  tags: string[];
  harmonyScore: number;
}

export interface StylistRank {
  rank: number;
  name: string;
  district: string;
  votes: number;
  badge: string;
  avatarKey: 'sand' | 'black' | 'olive';
  specialty: string;
}

export const SEED_DUEL_LOOKS: [SeedLook, SeedLook] = [
  {
    id: 'look-a-london',
    stylistName: 'Amina M.',
    district: 'Central London',
    city: 'London',
    country: 'UK',
    lookTitle: 'Sand Open Abaya + Silk Ivory Drape',
    avatarKey: 'sand',
    tones: ['#CBB180', '#FDFBF7'],
    votes: 384,
    tags: ['Daily', 'Linen'],
    harmonyScore: 98,
  },
  {
    id: 'look-b-knightsbridge',
    stylistName: 'Sarah K.',
    district: 'Knightsbridge',
    city: 'London',
    country: 'UK',
    lookTitle: 'Olive Trench + Rose Chiffon',
    avatarKey: 'olive',
    tones: ['#646B3A', '#D6937C'],
    votes: 216,
    tags: ['Campus', 'Autumn'],
    harmonyScore: 94,
  },
];

export const SEED_LEADERBOARD_DISTRICT: StylistRank[] = [
  {
    rank: 1,
    name: 'Fatima M.',
    district: 'Central District',
    votes: 2480,
    badge: '👑 Master Stylist',
    avatarKey: 'sand',
    specialty: 'Monochrome Linen',
  },
  {
    rank: 2,
    name: 'Layla K.',
    district: 'Mayfair',
    votes: 1920,
    badge: 'Haute Curator',
    avatarKey: 'black',
    specialty: 'Minimalist Noir',
  },
  {
    rank: 3,
    name: 'Zainab R.',
    district: 'Kensington',
    votes: 1640,
    badge: 'Atelier Elite',
    avatarKey: 'olive',
    specialty: 'Tonal Earth',
  },
  {
    rank: 4,
    name: 'Mariam H.',
    district: 'Marylebone',
    votes: 1410,
    badge: 'Linen Minimalist',
    avatarKey: 'sand',
    specialty: 'Crepe Flow',
  },
  {
    rank: 5,
    name: 'Nadia S.',
    district: 'Chelsea',
    votes: 1280,
    badge: 'Royal Velvet',
    avatarKey: 'black',
    specialty: 'Evening Gala',
  },
  {
    rank: 6,
    name: 'Samira B.',
    district: 'Soho',
    votes: 1150,
    badge: 'Monochrome Silk',
    avatarKey: 'olive',
    specialty: 'Campus Layer',
  },
];

export const SEED_LEADERBOARD_GLOBAL: StylistRank[] = [
  {
    rank: 1,
    name: 'Reem Al-Saud',
    district: 'Al-Nakheel, Riyadh',
    votes: 8940,
    badge: '👑 Global Icon',
    avatarKey: 'black',
    specialty: 'Saudi Royal Crepe',
  },
  {
    rank: 2,
    name: 'Ayla D.',
    district: 'Downtown Dubai',
    votes: 7820,
    badge: 'Runway Visionary',
    avatarKey: 'sand',
    specialty: 'Desert Gold Linen',
  },
  {
    rank: 3,
    name: 'Fatima M.',
    district: 'London, UK',
    votes: 6410,
    badge: 'Atelier Elite',
    avatarKey: 'olive',
    specialty: 'Chic Trench',
  },
];
