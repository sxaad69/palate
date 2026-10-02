# Data Safety — ModestFit (Play Console declaration draft)

**Posture:** local-only v1. No account, no analytics, no ads.

## Data collected
- **Photos and videos** (wardrobe piece photos): collected, stored on-device only, NOT shared with third parties, NOT used for tracking. Optional — the app works without photos.
- **App activity** (outfit plans, wear counts): stored on-device only, not shared.
- **App info and performance** (purchase status via Play Billing): used for app functionality (unlocking Pro).

## Data shared with third parties
- **Financial info** (via Google Play Billing): shared with Google solely to process the subscription purchase. Encrypted in transit.

## Security
- Data is encrypted in transit (Play Billing).
- Users can request data deletion by deleting the app (all data is local).
- No data is sold or used for advertising.

## Notes for the Play Console form
- "Does your app collect or share any of the required user data types?" → Yes (photos, app activity — on-device).
- "Is all of the user data collected by your app encrypted in transit?" → Yes.
- "Do you provide a way for users to request that their data is deleted?" → Yes (in-app: deleting the app removes all local data; state this in the store listing).
