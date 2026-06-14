# NFC Certificate of Authenticity — MVP

A premium, mobile-first authentication system for limited edition products.
Each physical item carries an NFC tag. Tap it with a phone and a private
**Certificate of Authenticity** opens, showing the product, its unique ID, the
registered owner, and its status. Ownership is managed from a password-protected
admin panel, and every transfer is recorded in a provenance history.

Built with **Next.js (App Router) + Tailwind CSS**. Database is a simple **JSON
file** — zero external setup, deploys to Vercel in minutes. (A Google Sheets
swap is documented at the bottom if you prefer editing in a spreadsheet.)

---

## What it does

- **Public certificate page** (`/item/CAM-0001`) — luxury black/white certificate
  with an embossed verification seal, a "Verified Authentic" badge, and an
  ownership-history timeline. Server-rendered for instant load on a phone.
- **Counterfeit detection** — unknown IDs land on a styled "Not Verified" page.
- **Admin panel** (`/admin`) — password-gated. List all items, edit owner,
  change status, mark transfers.
- **Automatic provenance** — changing an owner records the previous owner in the
  history log automatically. No manual logging.

---

## Project structure

```
nfc-auth/
├── app/
│   ├── layout.js                 # Root layout + fonts
│   ├── page.js                   # Landing page
│   ├── globals.css               # Styles + animations
│   ├── item/[id]/
│   │   ├── page.js               # PUBLIC certificate page (server component)
│   │   └── not-found.js          # "Not Verified" page for bad IDs
│   ├── admin/
│   │   └── page.js               # Admin dashboard (client component)
│   └── api/
│       ├── item/[id]/route.js    # GET public certificate data
│       └── admin/
│           ├── login/route.js    # POST validate password
│           ├── items/route.js    # GET all items (protected)
│           └── update/route.js   # POST update owner/status (protected)
├── components/
│   └── Seal.jsx                  # The embossed verification seal (SVG)
├── lib/
│   ├── db.js                     # Read/write JSON + transfer & history logic
│   └── auth.js                   # Password check helper
├── data/
│   ├── items.json                # ← your product database
│   └── history.json              # ← provenance log (auto-written)
├── .env.local                    # ADMIN_PASSWORD lives here
├── package.json
└── ... config files
```

---

## Run locally (beginner steps)

You need **Node.js 18+** installed ([nodejs.org](https://nodejs.org)).

1. Open a terminal in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your admin password. Open `.env.local` and change the value:
   ```
   ADMIN_PASSWORD=your-secret-password
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open these in your browser:
   - Landing page → http://localhost:3000
   - Sample certificate → http://localhost:3000/item/CAM-0001
   - Admin panel → http://localhost:3000/admin

That's it. Edit a certificate from the admin panel and refresh the certificate
page to see the change.

---

## Deploy to Vercel (free)

1. Push this folder to a **GitHub** repository.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click
   **Add New → Project**, and import the repo.
3. Before deploying, open **Environment Variables** and add:
   - Key: `ADMIN_PASSWORD`  Value: `your-secret-password`
4. Click **Deploy**. You'll get a live URL like
   `https://your-project.vercel.app`.

Your certificates are now live at
`https://your-project.vercel.app/item/CAM-0001`.

> **Important note on the JSON database + Vercel.** Vercel's filesystem is
> read-only at runtime, so edits made through the admin panel in production are
> not saved permanently — they reset on the next deploy. This is perfect for a
> **demo/MVP**. The moment you want persistent edits in production, switch the
> database to **Google Sheets** (see below) or a hosted DB (Vercel KV, Supabase).
> Locally, edits persist to the JSON file normally.

---

## How NFC tags connect to the system

NFC tags are tiny, cheap (~€0.30–1.00) programmable chips. You can embed them in
a garment's care label, a hangtag, or a sticker.

1. **Program each tag with a URL.** Using a free phone app like **NFC Tools**
   (iOS/Android), write a *URL record* to the tag pointing at that item's
   certificate:
   ```
   https://your-project.vercel.app/item/CAM-0001
   ```
   Each tag gets its own unique ID (`CAM-0001`, `CAM-0002`, …).

2. **A customer taps the tag** with their phone. Modern iPhones and Android
   phones read NFC automatically — no app needed. The phone shows a
   notification; tapping it opens the URL in the browser.

3. **The certificate page loads**, looks up `CAM-0001` in the database, and
   renders the owner, status, and provenance. Done.

So the flow is simply: **Tag holds a URL → phone opens URL → page reads the ID
from the URL → database returns that item's certificate.** The "intelligence"
lives entirely in your web app; the tag is just a physical link to a URL.

> Tip: lock/protect your tags in the NFC Tools app after writing so the URL
> can't be overwritten.

---

## API reference

| Method | Endpoint              | Auth        | Purpose                          |
|--------|-----------------------|-------------|----------------------------------|
| GET    | `/api/item/[id]`      | Public      | Certificate data for one item    |
| POST   | `/api/admin/login`    | —           | Validate admin password          |
| GET    | `/api/admin/items`    | Password    | List all items                   |
| POST   | `/api/admin/update`   | Password    | Update owner/status + log change |

Protected endpoints require an `x-admin-password` header. Update body:
```json
{ "item_id": "CAM-0001", "owner_name": "New Owner", "status": "Transferred" }
```

---

## Adding new products

Open `data/items.json` and add an entry to the `items` array:

```json
{
  "item_id": "CAM-0004",
  "product_name": "Limited Edition Hoodie",
  "edition": "04 / 50",
  "owner_name": "Unclaimed",
  "status": "Active",
  "last_updated": "2026-06-14T10:00:00.000Z"
}
```

Then program an NFC tag pointing at `/item/CAM-0004`.

---

## Optional: use Google Sheets instead of JSON

If you'd rather manage ownership in a spreadsheet (and want production edits to
persist), see **`GOOGLE_SHEETS.md`** for a drop-in replacement of `lib/db.js`.
The rest of the app — pages, admin panel, design — stays exactly the same.

---

## Security notes (MVP level)

- The admin panel and write APIs are protected by a single password stored as an
  environment variable (never committed).
- Public users can only **read** certificates; there is no public write path.
- For a real production system, upgrade to proper auth (e.g. Auth.js), rate
  limiting, and a hosted database. This MVP is intentionally minimal.
