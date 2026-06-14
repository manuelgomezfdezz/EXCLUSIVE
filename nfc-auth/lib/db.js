import { promises as fs } from "fs";
import path from "path";

// Resolve absolute paths to the JSON "database" files.
const DATA_DIR = path.join(process.cwd(), "data");
const ITEMS_PATH = path.join(DATA_DIR, "items.json");
const HISTORY_PATH = path.join(DATA_DIR, "history.json");

// --- Low-level read/write helpers ---

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// --- Items ---

export async function getAllItems() {
  const db = await readJson(ITEMS_PATH);
  return db.items;
}

export async function getItemById(itemId) {
  const items = await getAllItems();
  return items.find((i) => i.item_id === itemId) || null;
}

// --- History ---

export async function getHistoryForItem(itemId) {
  const db = await readJson(HISTORY_PATH);
  return db.history
    .filter((h) => h.item_id === itemId)
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
}

// --- Update + transfer logic ---
// Updates an item and records a history entry whenever the owner or status
// changes. The "previous owner" is captured automatically.

export async function updateItem(itemId, { owner_name, status }) {
  const db = await readJson(ITEMS_PATH);
  const index = db.items.findIndex((i) => i.item_id === itemId);

  if (index === -1) {
    throw new Error(`Item ${itemId} not found`);
  }

  const current = db.items[index];
  const nextOwner = owner_name ?? current.owner_name;
  const nextStatus = status ?? current.status;

  const ownerChanged = nextOwner !== current.owner_name;
  const statusChanged = nextStatus !== current.status;

  // Nothing actually changed — return early.
  if (!ownerChanged && !statusChanged) {
    return current;
  }

  const now = new Date().toISOString();

  // Apply the update.
  const updated = {
    ...current,
    owner_name: nextOwner,
    status: nextStatus,
    last_updated: now,
  };
  db.items[index] = updated;
  await writeJson(ITEMS_PATH, db);

  // Record the change in the history log.
  const historyDb = await readJson(HISTORY_PATH);
  historyDb.history.push({
    item_id: itemId,
    previous_owner: current.owner_name,
    new_owner: nextOwner,
    previous_status: current.status,
    new_status: nextStatus,
    changed_at: now,
  });
  await writeJson(HISTORY_PATH, historyDb);

  return updated;
}
