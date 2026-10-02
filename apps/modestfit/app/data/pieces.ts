// ModestFit data model — modesty-first wardrobe.
// Differentiator #1: every piece carries coverage attributes (sleeve, hem,
// opacity); the outfit checker flags combos that miss the user's prefs.

export type Category =
  | 'abaya'
  | 'hijab'
  | 'skirt'
  | 'trousers'
  | 'top'
  | 'dress'
  | 'outerwear';

export type Sleeve = 'sleeveless' | 'short' | 'threeQuarter' | 'long' | 'na';
export type Hem = 'short' | 'knee' | 'midi' | 'maxi' | 'floor' | 'na';
export type Opacity = 'opaque' | 'semiSheer' | 'sheer';

export type Occasion = 'daily' | 'work' | 'wedding' | 'travel' | 'evening';

export type ColorKey =
  | 'black'
  | 'white'
  | 'ivory'
  | 'beige'
  | 'sand'
  | 'grey'
  | 'navy'
  | 'olive'
  | 'rose'
  | 'taupe'
  | 'brown';

export interface PieceDef {
  id: string;
  name: { en: string; ar: string };
  category: Category;
  colorKey: ColorKey;
  colorHex: string;
  sleeve: Sleeve;
  hem: Hem;
  opacity: Opacity;
  occasions: Occasion[];
}

export interface OwnedPiece extends PieceDef {
  photo?: string; // local file URI
  wearCount: number;
  addedAt: number;
}

export interface Outfit {
  id: string;
  name: string;
  pieceIds: string[];
  occasion: Occasion;
  createdAt: number;
}

export interface PlanEntry {
  outfitId: string;
  occasion: Occasion;
  worn: boolean;
}

export interface ModestyPrefs {
  minSleeve: 'short' | 'threeQuarter' | 'long';
  minHem: 'knee' | 'midi' | 'maxi' | 'floor';
  sheer: 'opaqueOnly' | 'allowSemi';
}

export const DEFAULT_PREFS: ModestyPrefs = {
  minSleeve: 'long',
  minHem: 'midi',
  sheer: 'opaqueOnly',
};

export const CATEGORIES: Category[] = [
  'abaya',
  'hijab',
  'skirt',
  'trousers',
  'top',
  'dress',
  'outerwear',
];

export const OCCASIONS: Occasion[] = ['daily', 'work', 'wedding', 'travel', 'evening'];

type P = [
  id: string,
  en: string,
  ar: string,
  category: Category,
  colorKey: ColorKey,
  colorHex: string,
  sleeve: Sleeve,
  hem: Hem,
  opacity: Opacity,
  occasions: Occasion[],
];

function p(t: P): PieceDef {
  const [id, en, ar, category, colorKey, colorHex, sleeve, hem, opacity, occasions] = t;
  return { id, name: { en, ar }, category, colorKey, colorHex, sleeve, hem, opacity, occasions };
}

// ~40-piece starter catalog. "own" is user state; the catalog is inspiration
// the user can add to their wardrobe (or add their own pieces with photos).
export const STARTER_CATALOG: PieceDef[] = [
  // Abayas
  p(['s01', 'Classic Black Abaya', 'عباية سوداء كلاسيكية', 'abaya', 'black', '#23201A', 'long', 'floor', 'opaque', ['daily', 'work', 'travel', 'evening']]),
  p(['s02', 'Sand Open Abaya', 'عباية مفتوحة بلون الرمل', 'abaya', 'sand', '#DCC9A6', 'long', 'floor', 'opaque', ['daily', 'work', 'evening']]),
  p(['s03', 'Olive Embroidered Abaya', 'عباية مطرزة زيتية', 'abaya', 'olive', '#7C8547', 'long', 'floor', 'opaque', ['wedding', 'evening']]),
  p(['s04', 'Navy Crepe Abaya', 'عباية كريب كحلية', 'abaya', 'navy', '#2E3A52', 'long', 'floor', 'opaque', ['work', 'daily']]),
  p(['s05', 'Beige Linen Abaya', 'عباية كتان بيج', 'abaya', 'beige', '#D9C7A8', 'long', 'floor', 'opaque', ['daily', 'travel']]),
  p(['s06', 'Rose Wrap Abaya', 'عباية ملفوفة وردية', 'abaya', 'rose', '#C5735B', 'long', 'floor', 'opaque', ['evening', 'wedding']]),
  p(['s07', 'Grey Everyday Abaya', 'عباية يومية رمادية', 'abaya', 'grey', '#8A8578', 'long', 'floor', 'opaque', ['daily', 'work']]),
  p(['s08', 'White Umrah Abaya', 'عباية عمرة بيضاء', 'abaya', 'white', '#F5F2EA', 'long', 'floor', 'opaque', ['travel', 'daily']]),
  // Hijabs
  p(['s09', 'Black Chiffon Hijab', 'حجاب شيفون أسود', 'hijab', 'black', '#23201A', 'na', 'na', 'semiSheer', ['daily', 'work', 'evening', 'wedding']]),
  p(['s10', 'Ivory Jersey Hijab', 'حجاب جيرسي عاجي', 'hijab', 'ivory', '#F1EAD9', 'na', 'na', 'opaque', ['daily', 'work', 'travel']]),
  p(['s11', 'Sand Modal Hijab', 'حجاب مودال رملي', 'hijab', 'sand', '#DCC9A6', 'na', 'na', 'opaque', ['daily', 'work']]),
  p(['s12', 'Olive Modal Hijab', 'حجاب مودال زيتي', 'hijab', 'olive', '#97A05F', 'na', 'na', 'opaque', ['daily', 'evening']]),
  p(['s13', 'Rose Chiffon Hijab', 'حجاب شيفون وردي', 'hijab', 'rose', '#D6937C', 'na', 'na', 'semiSheer', ['evening', 'wedding']]),
  p(['s14', 'Navy Jersey Hijab', 'حجاب جيرسي كحلي', 'hijab', 'navy', '#2E3A52', 'na', 'na', 'opaque', ['work', 'daily']]),
  p(['s15', 'Grey Cotton Hijab', 'حجاب قطن رمادي', 'hijab', 'grey', '#8A8578', 'na', 'na', 'opaque', ['daily', 'work']]),
  p(['s16', 'Beige Linen Hijab', 'حجاب كتان بيج', 'hijab', 'beige', '#D9C7A8', 'na', 'na', 'opaque', ['daily', 'travel']]),
  p(['s17', 'White Prayer Hijab', 'حجاب صلاة أبيض', 'hijab', 'white', '#F5F2EA', 'na', 'na', 'opaque', ['daily', 'travel']]),
  p(['s18', 'Taupe Satin Hijab', 'حجاب ساتان طوبي', 'hijab', 'taupe', '#A89880', 'na', 'na', 'opaque', ['evening', 'wedding']]),
  // Skirts
  p(['s19', 'Black Maxi Skirt', 'تنورة ماكسي سوداء', 'skirt', 'black', '#23201A', 'na', 'maxi', 'opaque', ['daily', 'work']]),
  p(['s20', 'Beige Pleated Midi', 'تنورة بليسيه بيج', 'skirt', 'beige', '#D9C7A8', 'na', 'midi', 'opaque', ['work', 'daily']]),
  p(['s21', 'Navy A-Line Midi', 'تنورة كحلية', 'skirt', 'navy', '#2E3A52', 'na', 'midi', 'opaque', ['work']]),
  p(['s22', 'Olive Wrap Maxi', 'تنورة ملفوفة زيتية', 'skirt', 'olive', '#7C8547', 'na', 'maxi', 'opaque', ['daily', 'evening']]),
  p(['s23', 'Indigo Denim Midi', 'تنورة جينز ميدي', 'skirt', 'navy', '#3E4A5E', 'na', 'midi', 'opaque', ['daily']]),
  // Trousers
  p(['s24', 'Black Wide-Leg Trousers', 'بنطال واسع أسود', 'trousers', 'black', '#23201A', 'na', 'floor', 'opaque', ['work', 'daily']]),
  p(['s25', 'Beige Linen Trousers', 'بنطال كتان بيج', 'trousers', 'beige', '#D9C7A8', 'na', 'floor', 'opaque', ['daily', 'travel']]),
  p(['s26', 'White Palazzo Trousers', 'بنطال بالاتزو أبيض', 'trousers', 'white', '#F5F2EA', 'na', 'floor', 'opaque', ['daily', 'evening']]),
  p(['s27', 'Navy Tailored Trousers', 'بنطال كحلي', 'trousers', 'navy', '#2E3A52', 'na', 'floor', 'opaque', ['work']]),
  p(['s28', 'Grey Culottes', 'بنطال واسع رمادي', 'trousers', 'grey', '#8A8578', 'na', 'midi', 'opaque', ['daily']]),
  // Tops
  p(['s29', 'White Long Tunic', 'تونيك طويل أبيض', 'top', 'white', '#F5F2EA', 'long', 'maxi', 'opaque', ['daily', 'work']]),
  p(['s30', 'Beige Overshirt', 'قميص بيج طويل', 'top', 'beige', '#D9C7A8', 'long', 'midi', 'opaque', ['daily']]),
  p(['s31', 'Black Long-Sleeve Top', 'توب أسود بأكمام طويلة', 'top', 'black', '#23201A', 'long', 'knee', 'opaque', ['daily']]),
  p(['s32', 'Olive Blouse', 'بلوزة زيتية', 'top', 'olive', '#7C8547', 'long', 'knee', 'opaque', ['work']]),
  p(['s33', 'Rose Knit Top', 'توب محبوك وردي', 'top', 'rose', '#C5735B', 'long', 'knee', 'opaque', ['daily', 'evening']]),
  p(['s34', 'Navy Shirt', 'قميص كحلي', 'top', 'navy', '#2E3A52', 'long', 'knee', 'opaque', ['work']]),
  // Dresses
  p(['s35', 'Black Maxi Dress', 'فستان ماكسي أسود', 'dress', 'black', '#23201A', 'long', 'maxi', 'opaque', ['daily', 'evening', 'wedding']]),
  p(['s36', 'Sand Shirt Dress', 'فستان قميص رملي', 'dress', 'sand', '#DCC9A6', 'long', 'maxi', 'opaque', ['daily', 'work']]),
  p(['s37', 'Rose Midi Dress', 'فستان ميدي وردي', 'dress', 'rose', '#C5735B', 'long', 'midi', 'opaque', ['evening', 'wedding']]),
  p(['s38', 'Brown Wrap Maxi', 'فستان ملفوف بني', 'dress', 'brown', '#6B4F35', 'long', 'maxi', 'opaque', ['daily', 'evening']]),
  // Outerwear
  p(['s39', 'Camel Long Coat', 'معطف طويل جملي', 'outerwear', 'sand', '#B89A63', 'long', 'floor', 'opaque', ['travel', 'work', 'evening']]),
  p(['s40', 'Black Long Cardigan', 'كارديغان طويل أسود', 'outerwear', 'black', '#23201A', 'long', 'maxi', 'opaque', ['daily', 'work']]),
];
