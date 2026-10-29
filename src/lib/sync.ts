// One-way push to a Google Sheet through an Apps Script web app (see apps-script/Code.gs).
// Writes stay local-first: the UI never waits on the network, ops wait in a queue until sent.
import type { Detail } from "../redux/feature/detail"

export type SyncOp =
    | { op: "add", uid: string, tanggal: string, kategori: string, nama: string, nominal: number }
    | { op: "delete", uid: string }

const QUEUE = "SyncQueue"
const URL_KEY = "SheetUrl"

export const toAddOp = (d: Detail, kategori: string): SyncOp =>
    ({ op: "add", uid: d.uid, tanggal: d.createdAt, kategori, nama: d.title, nominal: d.amount })

export const getSheetUrl = () => localStorage.getItem(URL_KEY) ?? ""

const readQueue = (): SyncOp[] => {
    try { return JSON.parse(localStorage.getItem(QUEUE) ?? "[]") as SyncOp[] } catch { return [] }
}

let status = { pending: readQueue().length, error: "", sending: false }
const listeners = new Set<() => void>()
const update = (patch: Partial<typeof status>) => { status = { ...status, ...patch }; listeners.forEach((l) => l()) }
const writeQueue = (q: SyncOp[]) => { localStorage.setItem(QUEUE, JSON.stringify(q)); update({ pending: q.length }) }

// For useSyncExternalStore.
export const subscribeSync = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
export const getSyncStatus = () => status

// Nothing is queued until a Sheet is connected; connecting sends everything (see setSheetUrl).
export function enqueue(ops: SyncOp[]) {
    if (!getSheetUrl() || !ops.length) return
    writeQueue([...readQueue(), ...ops])
    void flush()
}

export function setSheetUrl(url: string, allItems: SyncOp[]) {
    url = url.trim()
    if (url && !/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) throw new Error("Link harus dari script.google.com (URL web app yang berakhiran /exec).")
    url ? localStorage.setItem(URL_KEY, url) : localStorage.removeItem(URL_KEY)
    if (!url) return writeQueue([])
    enqueue(allItems) // the script skips uids it already has, so re-sending is safe
}

export async function flush(): Promise<void> {
    const url = getSheetUrl()
    const batch = readQueue()
    if (!url || status.sending || !batch.length || !navigator.onLine) return
    update({ sending: true })
    try {
        // text/plain avoids a CORS preflight, which Apps Script can't answer.
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(batch) })
        const json = (await res.json().catch(() => ({ ok: false, error: `Sheet membalas HTTP ${res.status}` }))) as { ok: boolean, error?: string }
        if (!json.ok) throw new Error(json.error || "Sheet menolak data")
        writeQueue(readQueue().slice(batch.length)) // keep ops queued while this request was in flight
        update({ sending: false, error: "" })
        if (readQueue().length) return flush()
    } catch (e) {
        update({ sending: false, error: e instanceof Error ? e.message : String(e) })
    }
}

if (typeof window !== "undefined") window.addEventListener("online", () => void flush())
