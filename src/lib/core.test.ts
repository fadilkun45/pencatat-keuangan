import { beforeEach, describe, expect, it, vi } from 'vitest'

// Minimal localStorage so the real load/persist/sync code runs unchanged.
const mem = new Map<string, string>()
globalThis.localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, String(v)),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(),
    key: () => null, length: 0,
} as Storage
Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true })

const { load } = await import('./storage')
const { makeStore } = await import('../redux/store/Store')
const { addDetail, deleteDetail } = await import('../redux/feature/detail')
const { deleteList } = await import('../redux/feature/main')
const { budgetStatus, onlyNumber, sumAmount } = await import('./Formatter')
const { flush, setSheetUrl, getSyncStatus } = await import('./sync')

const legacy = () => {
    mem.clear()
    mem.set('MainList', JSON.stringify([{ id: 'c1', title: 'Makan', limit: 100000, currentAmount: 999, createdAt: '2026-01-01T00:00:00Z' }]))
    // old format: no uid, id = category id, identical twins
    mem.set('c1', JSON.stringify([
        { title: 'kopi', amount: 20000, id: 'c1', createdAt: '2026-01-02T00:00:00Z' },
        { title: 'kopi', amount: 20000, id: 'c1', createdAt: '2026-01-02T00:00:00Z' },
    ]))
}

describe('data lama', () => {
    beforeEach(legacy)

    it('dapat uid permanen dan total dihitung dari item, bukan currentAmount', () => {
        const a = load()
        const uids = a.detail.c1.map((d) => d.uid)
        expect(new Set(uids).size).toBe(2)
        expect(load().detail.c1.map((d) => d.uid)).toEqual(uids) // stable across loads
        expect(sumAmount(a.detail.c1)).toBe(40000)
    })

    it('hapus satu item kembar hanya menghapus item itu dan tersimpan', () => {
        const store = makeStore()
        const [first] = store.getState().detail.c1
        store.dispatch(deleteDetail(first))
        expect(JSON.parse(mem.get('c1')!)).toHaveLength(1)
        store.dispatch(addDetail({ uid: 'x', id: 'c1', title: 'bakso', amount: 15000, createdAt: '2026-01-03T00:00:00Z' }))
        expect(JSON.parse(mem.get('c1')!).map((d: { uid: string }) => d.uid)).toContain('x')
    })

    it('hapus kategori membuang item-itemnya dari storage', () => {
        const store = makeStore()
        store.dispatch(deleteList('c1'))
        expect(mem.has('c1')).toBe(false)
        expect(JSON.parse(mem.get('MainList')!)).toEqual([])
    })
})

describe('sync ke Sheet', () => {
    beforeEach(legacy)

    it('antre kalau gagal, kosong kalau berhasil, tanpa kehilangan op', async () => {
        const fetchMock = vi.fn().mockRejectedValueOnce(new Error('offline'))
        globalThis.fetch = fetchMock
        const store = makeStore()
        setSheetUrl('https://script.google.com/macros/s/abc/exec', [])
        store.dispatch(addDetail({ uid: 'y', id: 'c1', title: 'es teh', amount: 5000, createdAt: '2026-01-03T00:00:00Z' }))
        await vi.waitFor(() => expect(getSyncStatus().sending).toBe(false))
        expect(getSyncStatus().pending).toBe(1)
        expect(getSyncStatus().error).toBe('offline')

        fetchMock.mockResolvedValue({ status: 200, json: () => Promise.resolve({ ok: true }) })
        await flush()
        expect(getSyncStatus().pending).toBe(0)
        const sent = JSON.parse((fetchMock.mock.calls.at(-1) as [string, RequestInit])[1].body as string) as Record<string, unknown>[]
        expect(sent[0]).toMatchObject({ op: 'add', uid: 'y', kategori: 'Makan', nominal: 5000 })
    })

    it('menolak link yang bukan Apps Script', () => {
        expect(() => setSheetUrl('https://evil.example/exec', [])).toThrow()
    })
})

it('status budget aman untuk limit 0 dan input aneh', () => {
    expect(budgetStatus(0, 0).pct).toBe(0)
    expect(budgetStatus(5000, 0)).toMatchObject({ pct: 100, message: 'JAJAN TEROS' })
    expect(budgetStatus(70, 100).tone).toBe('waspada')
    expect(onlyNumber('Rp 12.500')).toBe(12500)
    expect(onlyNumber('')).toBe(0)
})
