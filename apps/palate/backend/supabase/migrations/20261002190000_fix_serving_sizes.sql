-- Fix serving_size_g semantics (see audit notes below).
--
-- The source data (nutri-llm-library) mixes two conventions with no label:
-- dips/snacks/salads/sides are per-100g, while mains/breakfasts/soups/
-- desserts/beverages are per-serving. Audit (2026-10-02) proved this via
-- macro impossibility: 20 mains carry protein/fat numbers that cannot exist
-- per 100g (e.g. 45g protein in mandi). Hummus (177) and falafel (333) match
-- USDA per-100g values exactly, confirming the per-100g side.
--
-- serving_size_g is the reference weight for the stored nutrition numbers:
-- analyze-meal scales as portion_g / serving_size_g, so a 450g AI portion
-- of kabsa (620 kcal per ~400g serving) now yields ~700 kcal, not 2790.
--
-- NOTE: dishes has no category column; updates are by name_en.

-- 15 dishes: typical serving 150g
update dishes set serving_size_g = 150 where name_en in ('Baklava', 'Basbousa', 'Halwa', 'Halwa Bahrainiya', 'Knafeh', 'Knafeh Nabulsiya', 'Libyan Asida', 'Luqaimat', 'Ma''amoul', 'Masoob', 'Muhallabia', 'Omani Halwa', 'Qatayef', 'Umm Ali', 'Zlabia');

-- 4 dishes: typical serving 250g
update dishes set serving_size_g = 250 where name_en in ('Ayran', 'Jallab', 'Karkade', 'Qahwa');

-- 7 dishes: typical serving 300g
update dishes set serving_size_g = 300 where name_en in ('Asida', 'Balaleet', 'Fatteh', 'Ful Medames', 'Manakish', 'Shakshuka', 'Simit');

-- 4 dishes: typical serving 350g
update dishes set serving_size_g = 350 where name_en in ('Chorba Frik', 'Harira', 'Lablabi', 'Sharba Libiya');

-- 50 dishes: typical serving 400g
update dishes set serving_size_g = 400 where name_en in ('Aleppo Kabab', 'Algerian Couscous', 'Bastilla', 'Bazin', 'Chakhchoukha', 'Chelo Kabab', 'Cherchem', 'Chermoula Fish', 'Chicken Shawarma', 'Chicken Tagine', 'Dolma in White Sauce', 'Doner Kebab', 'Fatteh Dimashqiya', 'Fesenjan', 'Freekeh Pilaf', 'Ghormeh Sabzi', 'Harees', 'Iskender Kebab', 'Jareesh', 'Kabsa', 'Kibbeh', 'Koshari', 'Leksour', 'Machboos', 'Machboos Qatari', 'Madrouba', 'Mahshi (Stuffed Vegetables)', 'Mandi', 'Mansaf', 'Manti', 'Maqluba', 'Maru Hout (Thieboudienne)', 'Mashuai', 'Moroccan Couscous', 'Mujaddara', 'Mullah', 'Murabyan', 'Musakhan', 'Mutabbaq Samak', 'Méchoui Mauritanien', 'Ojja', 'Ouzi', 'Rechta', 'Saleeg', 'Shuwa', 'Sudanese Aseeda', 'Tunisian Tajine', 'Usban', 'Zarb', 'Zereshk Polo');
