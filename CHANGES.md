# mkc-v90 (built on GitHub main = mkc-v89)
Files: index.html, sw.js (cache mkc-v90). Upload both to the repo main, then reload the app twice.

1. আয়/ব্যয় form: tap উৎস / ধরন / পণ্য box -> list popup (search, tick box). Manage mode: select all, লুকান, দেখান (uses the same hidden lists as তালিকা ব্যবস্থাপনা).
2. Every expense category now has 5+ sub items, চাকরি has 5 (added once for existing users).
3. Contact page: history wording বিক্রি/কেনা -> আয়/ব্যয়; "+" -> edit icon (name, number, address, delete). Delete removes the contact only, transactions stay.
4. New menu item মাসিক রিপোর্ট (month totals, খাত wise expense, বাজার items, income sources). New বাজার transactions save item names (tx.bz).
5. Month-end popup (30th to 5th) once per month, plus system notification if permission already granted.
6. Dark/light colour list (CSS block mk-dark-light-colors-v1), scoped to inner pages; home and main menu untouched.
Tested in jsdom: 28 checks passed.
