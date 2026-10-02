# Google Play Data Safety — StraightUp (com.straightup.posture)

**Does the app collect or share any user data?** No.

- **Data collected:** None. No personal data, no photos, no health data, no device identifiers leave the device.
- **Data shared with third parties:** None. (Google Play processes subscription purchases under Google's own terms; the app itself sends nothing.)
- **Photos:** Captured or picked posture photos are stored in the app's private on-device storage and analyzed on-device. They are never uploaded, transmitted, or shared.
- **Security practices:** Not applicable — there is no server, no account system, and no data transmission. All state lives in on-device storage.
- **Account deletion:** No account exists. Uninstalling the app removes all local data.

**Permissions declared and why:**
- `CAMERA` — capture the side-profile posture photo (optional; gallery picker available).
- `POST_NOTIFICATIONS` — local "unhunch" reminders scheduled on-device.
- `READ_MEDIA_IMAGES` (or scoped storage equivalent) — only when the user picks an existing photo from the gallery.
