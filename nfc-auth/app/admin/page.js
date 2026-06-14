"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ownerInput, setOwnerInput] = useState("");
  const [statusInput, setStatusInput] = useState("Active");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // --- Auth ---
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      loadItems();
    } else {
      setLoginError("Incorrect password. Try again.");
    }
  }

  // --- Data ---
  async function loadItems() {
    const res = await fetch("/api/admin/items", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
  }

  function selectItem(item) {
    setSelected(item);
    setOwnerInput(item.owner_name);
    setStatusInput(item.status);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({
        item_id: selected.item_id,
        owner_name: ownerInput,
        status: statusInput,
      }),
    });
    setSaving(false);
    if (res.ok) {
      showToast("Saved. History updated.");
      await loadItems();
      const data = await res.json();
      setSelected(data.item);
    } else {
      showToast("Error saving.");
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  // --- Login screen ---
  if (!authed) {
    return (
      <main className="min-h-screen bg-ink text-paper flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs fade-up">
          <p className="text-[10px] tracking-widest2 uppercase text-paper/45 font-medium mb-3 text-center">
            Registry Control
          </p>
          <h1 className="font-serif text-4xl text-center mb-8">Admin Access</h1>
          <label className="block text-[10px] tracking-widest2 uppercase text-paper/50 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-paper/25 rounded px-4 py-3 text-sm focus:border-paper/60 outline-none transition"
            placeholder="••••••••"
            autoFocus
          />
          {loginError && (
            <p className="text-amber-500 text-xs mt-3">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full mt-5 bg-paper text-ink text-[11px] tracking-widest2 uppercase rounded py-3 hover:opacity-90 transition"
          >
            Enter
          </button>
          <a
            href="/"
            className="block text-center text-[10px] tracking-widest2 uppercase text-paper/35 hover:text-paper/60 transition mt-6"
          >
            Back to site
          </a>
        </form>
      </main>
    );
  }

  // --- Dashboard ---
  return (
    <main className="min-h-screen bg-ink text-paper px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-paper/15 pb-5 mb-8">
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-paper/45 font-medium">
              Registry Control
            </p>
            <h1 className="font-serif text-3xl mt-1">Ownership Manager</h1>
          </div>
          <a
            href="/"
            className="text-[10px] tracking-widest2 uppercase text-paper/40 hover:text-paper/70 transition"
          >
            View Site
          </a>
        </div>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-8">
          {/* Items table */}
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-paper/45 mb-4">
              All Items ({items.length})
            </p>
            <div className="border border-paper/15 rounded overflow-hidden">
              {items.map((item, i) => {
                const isSel = selected?.item_id === item.item_id;
                return (
                  <button
                    key={item.item_id}
                    onClick={() => selectItem(item)}
                    className={`w-full text-left px-4 py-3.5 flex items-center justify-between transition ${
                      i !== items.length - 1 ? "border-b border-paper/10" : ""
                    } ${isSel ? "bg-paper text-ink" : "hover:bg-paper/5"}`}
                  >
                    <div>
                      <p className="text-sm font-medium tracking-wide">
                        {item.item_id}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          isSel ? "text-ink/60" : "text-paper/50"
                        }`}
                      >
                        {item.owner_name}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border ${
                        item.status === "Transferred"
                          ? "border-amber-500/40 text-amber-500"
                          : isSel
                          ? "border-emerald-700/40 text-emerald-700"
                          : "border-emerald-500/40 text-emerald-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit panel */}
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-paper/45 mb-4">
              Edit Record
            </p>
            {!selected ? (
              <div className="border border-dashed border-paper/20 rounded px-6 py-12 text-center">
                <p className="text-sm text-paper/40">
                  Select an item to edit its ownership and status.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSave}
                className="border border-paper/15 rounded p-6 space-y-5"
              >
                <div>
                  <p className="text-[9px] tracking-widest2 uppercase text-paper/40 mb-1">
                    Reference
                  </p>
                  <p className="font-serif text-2xl">{selected.item_id}</p>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest2 uppercase text-paper/50 mb-2">
                    Owner Name
                  </label>
                  <input
                    value={ownerInput}
                    onChange={(e) => setOwnerInput(e.target.value)}
                    className="w-full bg-transparent border border-paper/25 rounded px-4 py-2.5 text-sm focus:border-paper/60 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest2 uppercase text-paper/50 mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Active", "Transferred"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatusInput(s)}
                        className={`text-[11px] tracking-widest uppercase py-2.5 rounded border transition ${
                          statusInput === s
                            ? "bg-paper text-ink border-paper"
                            : "border-paper/25 text-paper/60 hover:border-paper/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-paper text-ink text-[11px] tracking-widest2 uppercase rounded py-3 hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save & Log Change"}
                </button>

                <p className="text-[10px] text-paper/35 leading-relaxed text-center">
                  Changing the owner records the previous owner in the provenance
                  history automatically.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-paper text-ink text-xs tracking-wide px-5 py-3 rounded-full shadow-lg fade-up">
          {toast}
        </div>
      )}
    </main>
  );
}
