# MK Day security hardening — deployment gate

## Important
These rules are a baseline and are NOT active until deployed to the correct Firebase project. Do not claim the app is secured until deployment and tests pass. The current app still stores homeAds inside each user's private users/{uid} document; shared publicAds is a separate future migration and is not yet wired into the UI.

## Owner identity
Owner email is fixed to the verified Firebase Authentication email:
imran1914771651@gmail.com

The rules require both exact email match and email_verified == true. For stronger future authorization, migrate to a server-assigned Firebase custom claim (owner: true) and remove email-based authorization after the claim is verified.

## Firestore rules baseline
- users/{uid}: only the authenticated user with matching UID can read/write their own document.
- appConfig/publicAds: signed-in users can read; only verified owner can write/delete; at most 3 slides.
- all other paths are denied.

## Storage rules baseline
- publicAds/*: public read; verified owner-only image upload/update/delete; images only; maximum 5 MiB.
- all other paths denied.

## Required manual steps before deployment
1. Open Firebase Console and select the exact project used by the live app.
2. In Authentication > Sign-in method, ensure Google sign-in is enabled.
3. Sign in with the owner Gmail and verify the account's email_verified status in Authentication > Users.
4. In Firestore Database > Rules, inspect the existing rules and confirm the live app uses only users/{uid} for account sync. Back up the current rules before replacing them.
5. Deploy firestore.rules. Test: owner can read/write own users/{uid}; a second test account cannot read/write the owner's document; neither account can read/write arbitrary paths; only owner can write appConfig/publicAds.
6. In Storage > Rules, back up existing rules, then deploy storage.rules. Test owner upload/delete and non-owner denial.
7. Enable Firebase App Check for the web app (reCAPTCHA Enterprise where available); first monitor metrics, then enforce for Firestore and Storage after confirming legitimate traffic.
8. Enable multi-factor authentication for the owner Google account, secure recovery email/phone, and use a unique password with a password manager.
9. Enable Firebase budget alerts and usage alerts. Set up scheduled Firestore exports to a separate protected backup destination and test restoration.
10. Do not make the GitHub repository private until a replacement hosting/deployment workflow is configured and tested. GitHub Pages requires a public repository on the current setup.

## Not yet implemented
- Shared banner read/write integration in index.html.
- Moving banner binary files from base64 in user documents to Firebase Storage.
- Owner-only UI controls in the app.
- Firebase App Check client initialization.
- Custom domain and replacement hosting.
- Automated backups and restore test.
- End-to-end security tests with a non-owner account.

## Security limitation
No system can guarantee 100% security. This baseline reduces unauthorized access only after correct deployment and verification. Firebase client configuration values are not secrets; authorization must be enforced by Firebase Security Rules and trusted server-side code. Never put service-account keys or private credentials in frontend code or GitHub.
