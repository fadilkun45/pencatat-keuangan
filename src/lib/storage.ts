import type { MainList } from "../redux/feature/main"
import type { Detail } from "../redux/feature/detail"

// crypto.randomUUID only exists on https/localhost; the fallback keeps LAN dev (http://192.168…) working.
export const newId = () => crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)

export function readArray<T>(key: string): T[] {
    try {
        const v: unknown = JSON.parse(localStorage.getItem(key) ?? "null")
        return Array.isArray(v) ? (v as T[]) : []
    } catch {
        return []
    }
}

// Reads the same keys the old version wrote. Old items have no uid, so one is assigned
// and written back immediately — otherwise it would change on every load and duplicate rows in the Sheet.
export function load() {
    const mainList = readArray<MainList>("MainList")
    const detail: Record<string, Detail[]> = {}
    for (const c of mainList) {
        const items = readArray<Detail>(c.id)
        let migrated = false
        for (const d of items) {
            if (!d.uid) { d.uid = newId(); migrated = true }
            d.id = c.id
        }
        if (migrated) localStorage.setItem(c.id, JSON.stringify(items))
        detail[c.id] = items
    }
    return { mainList, detail }
}
