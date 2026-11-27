# Inventory Journal + Replay (base: dev-transaction-connect-v2 @ c116ae3)

## What changed (index.html, sw.js cache mkc-v81 -> mkc-v82)
- Product stock (p.qty) and average cost (p.cost) are now computed ONLY by the Replay engine
  (bizJRun / bizJApply). Every purchase, sale and return gets a creation stamp `jc`; each product
  gets a baseline `p.base {id,q,c,at}` taken from its current stock/cost the first time it is touched.
- Sale `cost` / `profit` and sale-return `cost` are recomputed on every Replay (costAtSale).
- Delete / edit / tx-delete: simulated first (bizJTry); blocked if any later sale would go short.
  Message: "এই ক্রয় মুছলে <তারিখ>-এর বিক্রি ঘাটতিতে পড়বে ... আগে ওই বিক্রি ঠিক করুন।"
- Sale return re-enters at the original sale's costAtSale; purchase return leaves at the original purchase unit cost.
- Backdated entries (older date) go to the right place in the order (date, jc, id); full Replay.
- Records older than the baseline (legacy) are not guessed: deleting/editing them adjusts the baseline quantity only.
- Manual product cost edit starts a new baseline.
- After cloud load, bizJRecalcAll() recomputes stock/cost from the journal.
- Double tap on Delete: second tap finds no record and does nothing; same for tx delete.
- Id collision guard in bizJAdd.

## Direct p.qty / p.cost writers (audit, original dev code)
bizAddProduct (opening stock, kept = baseline), bizEditProduct (cost -> rebase), bizTxPost, bizTxRevert,
bizStock, bizEditEntry, bizDeleteEntry, bizReturn, bizSaleSave -> all but the first two now go through the engine.

## Not done (needs a separate decision)
- Two-device merge: the app syncs ONE whole document (last write wins; remote replaces local on login).
  This already applies to the whole app, not only inventory. Replay keeps stock consistent with whatever
  data is loaded, but no per-entry conflict screen was built.

## Tests (real app code run in jsdom, test_journal_replay.js): 33 passed, 0 failed
Old dev code on the same tests: T2 (cost stays 36 instead of 30), T3, T4 fail (the reported bug).
