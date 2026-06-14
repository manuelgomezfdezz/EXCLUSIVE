# Using Google Sheets as the database

This is an **optional** alternative to the JSON file. Use it if you want to
manage ownership directly in a spreadsheet and have edits persist in production
on Vercel. The app's pages, admin panel, and design do not change — you only
swap the contents of `lib/db.js`.

## 1. Create the sheet

Make a new Google Sheet with **two tabs**.

**Tab `Items`** — header row exactly:

| item_id | product_name | edition | owner_name | status | last_updated |
|---------|--------------|---------|------------|--------|--------------|
| CAM-0001 | Limited Edition T-Shirt | 01 / 50 | Manu Rodríguez | Active | 2026-06-14T10:00:00.000Z |

**Tab `History`** — header row exactly:

| item_id | previous_owner | new_owner | previous_status | new_status | changed_at |
|---------|----------------|-----------|-----------------|------------|------------|

## 2. Create a Service Account (gives the app permission)

1. Go to [console.cloud.google.com](https://console.cloud.google.com), create a
   project.
2. Enable the **Google Sheets API**.
3. Create credentials → **Service Account**. Download the JSON key.
4. Open your Google Sheet → **Share** → paste the service account's email
   (looks like `name@project.iam.gserviceaccount.com`) with **Editor** access.

## 3. Add environment variables

In `.env.local` (and in Vercel's project settings for production):

```
GOOGLE_SHEET_ID=the-long-id-from-your-sheet-url
GOOGLE_SERVICE_ACCOUNT_EMAIL=name@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

(The sheet ID is the part of the URL between `/d/` and `/edit`.)

## 4. Install the client and swap db.js

```bash
npm install google-spreadsheet google-auth-library
```

Replace the **entire contents** of `lib/db.js` with the version below. It
exposes the exact same functions (`getAllItems`, `getItemById`,
`getHistoryForItem`, `updateItem`), so nothing else in the app needs to change.

```js
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function getDoc() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

function rowToItem(row) {
  return {
    item_id: row.get("item_id"),
    product_name: row.get("product_name"),
    edition: row.get("edition"),
    owner_name: row.get("owner_name"),
    status: row.get("status"),
    last_updated: row.get("last_updated"),
  };
}

export async function getAllItems() {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle["Items"];
  const rows = await sheet.getRows();
  return rows.map(rowToItem);
}

export async function getItemById(itemId) {
  const items = await getAllItems();
  return items.find((i) => i.item_id === itemId) || null;
}

export async function getHistoryForItem(itemId) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle["History"];
  const rows = await sheet.getRows();
  return rows
    .filter((r) => r.get("item_id") === itemId)
    .map((r) => ({
      item_id: r.get("item_id"),
      previous_owner: r.get("previous_owner"),
      new_owner: r.get("new_owner"),
      previous_status: r.get("previous_status"),
      new_status: r.get("new_status"),
      changed_at: r.get("changed_at"),
    }))
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
}

export async function updateItem(itemId, { owner_name, status }) {
  const doc = await getDoc();
  const itemsSheet = doc.sheetsByTitle["Items"];
  const rows = await itemsSheet.getRows();
  const row = rows.find((r) => r.get("item_id") === itemId);
  if (!row) throw new Error(`Item ${itemId} not found`);

  const currentOwner = row.get("owner_name");
  const currentStatus = row.get("status");
  const nextOwner = owner_name ?? currentOwner;
  const nextStatus = status ?? currentStatus;

  if (nextOwner === currentOwner && nextStatus === currentStatus) {
    return rowToItem(row);
  }

  const now = new Date().toISOString();
  row.set("owner_name", nextOwner);
  row.set("status", nextStatus);
  row.set("last_updated", now);
  await row.save();

  const historySheet = doc.sheetsByTitle["History"];
  await historySheet.addRow({
    item_id: itemId,
    previous_owner: currentOwner,
    new_owner: nextOwner,
    previous_status: currentStatus,
    new_status: nextStatus,
    changed_at: now,
  });

  return rowToItem(row);
}
```

That's the whole swap. Run `npm run dev` and the app now reads and writes to your
Google Sheet. You can edit owners directly in the spreadsheet too — though
edits made there won't auto-log to History (only admin-panel changes do).
