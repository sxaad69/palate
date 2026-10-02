# Palate — Brand & Theme Brief

AI food logger for non-Western cuisines worldwide. MENA-first launch.
Android-first. Bilingual AR/EN with RTL. Light + dark mode.

## Tone
Warm, trustworthy, joyful. Food is pleasure; health is care. Never clinical, never gym-bro.

## Color — primitive tokens

### Saffron (brand primary)
- saffron50:  #FDF6E9
- saffron100: #FAEBCF
- saffron200: #F5D69A
- saffron300: #EFBE66
- saffron400: #E9A63B
- saffron500: #E8930C  ← primary
- saffron600: #D97706
- saffron700: #B45309
- saffron800: #92400E
- saffron900: #78350F

### Warm neutrals (stone)
- stone50:  #FAF9F7
- stone100: #F5F3F0
- stone200: #E7E2DC
- stone300: #D6CFC6
- stone400: #A8A095
- stone500: #78716C
- stone600: #57534E
- stone700: #44403C
- stone800: #292524
- stone900: #1C1917
- stone950: #131210  ← dark bg

### Semantic
- success: #16A34A
- warning: #D97706
- danger:  #DC2626
- info:    #0284C7

## Semantic tokens (light)
- background: stone50
- surface: #FFFFFF
- surfaceAlt: stone100
- border: stone200
- borderStrong: stone300
- textPrimary: stone900
- textSecondary: stone600
- textTertiary: stone400
- textInverse: #FFFFFF
- accent: saffron600 (buttons), accentMuted: saffron100
- overlay: rgba(28,25,23,0.5)

## Semantic tokens (dark)
- background: stone950 (#131210)
- surface: #1E1C19
- surfaceAlt: #262320
- border: #332F2B
- borderStrong: #4A443D
- textPrimary: #F5F3F0
- textSecondary: #A8A095
- textTertiary: #6B6259
- textInverse: #1C1917
- accent: saffron400 (desaturated/lightened for dark)
- accentMuted: rgba(232,147,12,0.16)
- overlay: rgba(0,0,0,0.6)

## Typography (system fonts — San Francisco / Roboto)
- display: 32/40 bold — onboarding heroes
- h1: 24/32 bold
- h2: 20/28 semibold
- h3: 18/24 semibold
- body: 16/24 regular (never smaller for body)
- bodySmall: 14/20 regular — secondary only
- caption: 12/16 regular — metadata only
- overline: 11/16 uppercase, letter-spaced

Max 3 weights: 400 / 500 / 700.

## Spacing (4/8pt grid)
xs:4 sm:8 md:16 lg:24 xl:32 2xl:48 3xl:64

## Radius
sm:8 md:12 lg:16 xl:24 full:9999

## Signature elements
- Calorie ring (progress ring, saffron) on Today screen
- Meal cards with cuisine tag chips (e.g. "Levantine", "Gulf")
- Big friendly primary button: "Snap your meal"
- AR/EN toggle in profile; RTL layout mirrors automatically
