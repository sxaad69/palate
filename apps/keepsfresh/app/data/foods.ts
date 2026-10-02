// Smart expiry defaults: ~60 common foods with typical shelf life and an
// estimated unit price (USD) used for the waste-saved counter.
// days = typical shelf life in the default storage location, counted from
// the day the item is added. Users adjust per item — these are starting
// points, not food-safety advice.

export type FoodCategory =
  | 'dairy'
  | 'produce'
  | 'meat'
  | 'bakery'
  | 'dry'
  | 'drinks'
  | 'frozen'
  | 'condiments';

export type StorageLoc = 'pantry' | 'fridge' | 'freezer';

export interface FoodDefault {
  id: string;
  en: string;
  ar: string;
  cat: FoodCategory;
  loc: StorageLoc;
  days: number;
  price: number; // estimated unit price, USD
}

export const FOOD_DEFAULTS: FoodDefault[] = [
  // Dairy
  { id: 'milk', en: 'Milk', ar: 'حليب', cat: 'dairy', loc: 'fridge', days: 7, price: 3.5 },
  { id: 'eggs', en: 'Eggs', ar: 'بيض', cat: 'dairy', loc: 'fridge', days: 21, price: 4.0 },
  { id: 'yogurt', en: 'Yogurt', ar: 'زبادي', cat: 'dairy', loc: 'fridge', days: 14, price: 1.2 },
  { id: 'butter', en: 'Butter', ar: 'زبدة', cat: 'dairy', loc: 'fridge', days: 30, price: 4.5 },
  { id: 'cheddar', en: 'Cheddar cheese', ar: 'جبن شيدر', cat: 'dairy', loc: 'fridge', days: 21, price: 5.0 },
  { id: 'cream-cheese', en: 'Cream cheese', ar: 'جبن كريمي', cat: 'dairy', loc: 'fridge', days: 14, price: 3.0 },
  { id: 'sour-cream', en: 'Sour cream', ar: 'قشدة حامضة', cat: 'dairy', loc: 'fridge', days: 14, price: 2.5 },
  { id: 'labneh', en: 'Labneh', ar: 'لبنة', cat: 'dairy', loc: 'fridge', days: 10, price: 3.0 },
  // Produce
  { id: 'tomatoes', en: 'Tomatoes', ar: 'طماطم', cat: 'produce', loc: 'fridge', days: 5, price: 2.0 },
  { id: 'cucumbers', en: 'Cucumbers', ar: 'خيار', cat: 'produce', loc: 'fridge', days: 5, price: 1.5 },
  { id: 'lettuce', en: 'Lettuce', ar: 'خس', cat: 'produce', loc: 'fridge', days: 4, price: 2.0 },
  { id: 'spinach', en: 'Spinach', ar: 'سبانخ', cat: 'produce', loc: 'fridge', days: 3, price: 2.5 },
  { id: 'carrots', en: 'Carrots', ar: 'جزر', cat: 'produce', loc: 'fridge', days: 21, price: 1.5 },
  { id: 'potatoes', en: 'Potatoes', ar: 'بطاطس', cat: 'produce', loc: 'pantry', days: 30, price: 2.0 },
  { id: 'onions', en: 'Onions', ar: 'بصل', cat: 'produce', loc: 'pantry', days: 30, price: 1.5 },
  { id: 'garlic', en: 'Garlic', ar: 'ثوم', cat: 'produce', loc: 'pantry', days: 60, price: 1.0 },
  { id: 'apples', en: 'Apples', ar: 'تفاح', cat: 'produce', loc: 'fridge', days: 21, price: 3.0 },
  { id: 'bananas', en: 'Bananas', ar: 'موز', cat: 'produce', loc: 'pantry', days: 4, price: 1.5 },
  { id: 'oranges', en: 'Oranges', ar: 'برتقال', cat: 'produce', loc: 'fridge', days: 14, price: 3.0 },
  { id: 'lemons', en: 'Lemons', ar: 'ليمون', cat: 'produce', loc: 'fridge', days: 21, price: 2.0 },
  { id: 'strawberries', en: 'Strawberries', ar: 'فراولة', cat: 'produce', loc: 'fridge', days: 3, price: 4.0 },
  { id: 'grapes', en: 'Grapes', ar: 'عنب', cat: 'produce', loc: 'fridge', days: 7, price: 4.5 },
  { id: 'watermelon', en: 'Watermelon', ar: 'بطيخ', cat: 'produce', loc: 'fridge', days: 7, price: 5.0 },
  { id: 'bell-peppers', en: 'Bell peppers', ar: 'فلفل رومي', cat: 'produce', loc: 'fridge', days: 7, price: 2.5 },
  { id: 'broccoli', en: 'Broccoli', ar: 'بروكلي', cat: 'produce', loc: 'fridge', days: 5, price: 2.5 },
  { id: 'mushrooms', en: 'Mushrooms', ar: 'فطر', cat: 'produce', loc: 'fridge', days: 4, price: 3.0 },
  { id: 'fresh-herbs', en: 'Fresh herbs', ar: 'أعشاب طازجة', cat: 'produce', loc: 'fridge', days: 4, price: 2.0 },
  // Meat
  { id: 'chicken-breast', en: 'Chicken breast', ar: 'صدر دجاج', cat: 'meat', loc: 'fridge', days: 2, price: 6.0 },
  { id: 'ground-beef', en: 'Ground beef', ar: 'لحم مفروم', cat: 'meat', loc: 'fridge', days: 2, price: 7.0 },
  { id: 'fish-fillets', en: 'Fish fillets', ar: 'فيليه سمك', cat: 'meat', loc: 'fridge', days: 2, price: 8.0 },
  { id: 'sausages', en: 'Sausages', ar: 'سجق', cat: 'meat', loc: 'fridge', days: 7, price: 5.0 },
  { id: 'deli-turkey', en: 'Deli turkey slices', ar: 'شرائح ديك رومي', cat: 'meat', loc: 'fridge', days: 5, price: 4.5 },
  // Bakery
  { id: 'bread', en: 'Bread', ar: 'خبز', cat: 'bakery', loc: 'pantry', days: 5, price: 2.5 },
  { id: 'tortillas', en: 'Tortillas', ar: 'خبز تورتيا', cat: 'bakery', loc: 'pantry', days: 14, price: 3.0 },
  { id: 'croissants', en: 'Croissants', ar: 'كرواسون', cat: 'bakery', loc: 'pantry', days: 3, price: 3.5 },
  { id: 'bagels', en: 'Bagels', ar: 'بيغل', cat: 'bakery', loc: 'pantry', days: 5, price: 3.0 },
  // Dry goods
  { id: 'rice', en: 'Rice', ar: 'أرز', cat: 'dry', loc: 'pantry', days: 365, price: 8.0 },
  { id: 'pasta', en: 'Pasta', ar: 'معكرونة', cat: 'dry', loc: 'pantry', days: 365, price: 2.0 },
  { id: 'flour', en: 'Flour', ar: 'دقيق', cat: 'dry', loc: 'pantry', days: 180, price: 4.0 },
  { id: 'sugar', en: 'Sugar', ar: 'سكر', cat: 'dry', loc: 'pantry', days: 365, price: 3.0 },
  { id: 'oats', en: 'Oats', ar: 'شوفان', cat: 'dry', loc: 'pantry', days: 365, price: 4.5 },
  { id: 'lentils', en: 'Lentils', ar: 'عدس', cat: 'dry', loc: 'pantry', days: 365, price: 3.5 },
  { id: 'chickpeas', en: 'Chickpeas', ar: 'حمص', cat: 'dry', loc: 'pantry', days: 365, price: 3.0 },
  { id: 'canned-tomatoes', en: 'Canned tomatoes', ar: 'طماطم معلبة', cat: 'dry', loc: 'pantry', days: 540, price: 2.0 },
  { id: 'olive-oil', en: 'Olive oil', ar: 'زيت زيتون', cat: 'dry', loc: 'pantry', days: 540, price: 9.0 },
  { id: 'honey', en: 'Honey', ar: 'عسل', cat: 'dry', loc: 'pantry', days: 365, price: 7.0 },
  { id: 'coffee', en: 'Coffee', ar: 'قهوة', cat: 'dry', loc: 'pantry', days: 180, price: 10.0 },
  { id: 'tea', en: 'Tea', ar: 'شاي', cat: 'dry', loc: 'pantry', days: 365, price: 5.0 },
  { id: 'cereal', en: 'Breakfast cereal', ar: 'حبوب الإفطار', cat: 'dry', loc: 'pantry', days: 180, price: 4.5 },
  { id: 'nuts', en: 'Nuts', ar: 'مكسرات', cat: 'dry', loc: 'pantry', days: 180, price: 8.0 },
  // Drinks
  { id: 'orange-juice', en: 'Orange juice', ar: 'عصير برتقال', cat: 'drinks', loc: 'fridge', days: 7, price: 4.0 },
  { id: 'soda', en: 'Soda', ar: 'مشروب غازي', cat: 'drinks', loc: 'pantry', days: 180, price: 1.5 },
  // Frozen
  { id: 'frozen-peas', en: 'Frozen peas', ar: 'بازلاء مجمدة', cat: 'frozen', loc: 'freezer', days: 365, price: 2.5 },
  { id: 'frozen-berries', en: 'Frozen berries', ar: 'توت مجمد', cat: 'frozen', loc: 'freezer', days: 365, price: 6.0 },
  { id: 'ice-cream', en: 'Ice cream', ar: 'آيس كريم', cat: 'frozen', loc: 'freezer', days: 120, price: 5.0 },
  { id: 'frozen-pizza', en: 'Frozen pizza', ar: 'بيتزا مجمدة', cat: 'frozen', loc: 'freezer', days: 120, price: 6.5 },
  // Condiments
  { id: 'ketchup', en: 'Ketchup', ar: 'كاتشب', cat: 'condiments', loc: 'pantry', days: 180, price: 3.5 },
  { id: 'mayonnaise', en: 'Mayonnaise', ar: 'مايونيز', cat: 'condiments', loc: 'fridge', days: 60, price: 4.0 },
  { id: 'mustard', en: 'Mustard', ar: 'خردل', cat: 'condiments', loc: 'pantry', days: 365, price: 3.0 },
  { id: 'soy-sauce', en: 'Soy sauce', ar: 'صلصة الصويا', cat: 'condiments', loc: 'pantry', days: 365, price: 4.0 },
  { id: 'tahini', en: 'Tahini', ar: 'طحينة', cat: 'condiments', loc: 'pantry', days: 180, price: 6.0 },
];

export const CATEGORIES: { id: FoodCategory; en: string; ar: string }[] = [
  { id: 'dairy', en: 'Dairy', ar: 'ألبان' },
  { id: 'produce', en: 'Produce', ar: 'خضار وفواكه' },
  { id: 'meat', en: 'Meat & fish', ar: 'لحوم وأسماك' },
  { id: 'bakery', en: 'Bakery', ar: 'مخبوزات' },
  { id: 'dry', en: 'Dry goods', ar: 'بقالة جافة' },
  { id: 'drinks', en: 'Drinks', ar: 'مشروبات' },
  { id: 'frozen', en: 'Frozen', ar: 'مجمّدات' },
  { id: 'condiments', en: 'Condiments', ar: 'توابل وصلصات' },
];

// Perishability weight per category — feeds the waste-risk score.
export const PERISHABILITY: Record<FoodCategory, number> = {
  meat: 4,
  dairy: 3,
  produce: 3,
  bakery: 2.5,
  drinks: 1.5,
  condiments: 1,
  dry: 0.5,
  frozen: 0.3,
};

export function findFood(query: string, lang: 'en' | 'ar'): FoodDefault[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOOD_DEFAULTS.slice(0, 8);
  return FOOD_DEFAULTS.filter(
    (f) =>
      f.en.toLowerCase().includes(q) ||
      f.ar.includes(query.trim()) ||
      (lang === 'ar' && f.ar.includes(q)),
  ).slice(0, 8);
}

export function categoryName(id: FoodCategory, lang: 'en' | 'ar'): string {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? (lang === 'en' ? c.en : c.ar) : id;
}
