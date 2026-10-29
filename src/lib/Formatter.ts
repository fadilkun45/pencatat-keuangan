// Built once: constructing Intl formatters on every render was a real cost on low-end phones.
const rupiah = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })
const tanggal = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export const formatRupiah = (n: number) => rupiah.format(n || 0)
export const formatTanggal = (iso: string) => tanggal.format(new Date(iso))
export const onlyNumber = (s: string) => parseInt(s.replace(/[^\d]/g, ''), 10) || 0

export const sumAmount = (items: { amount: number }[] = []) => items.reduce((t, d) => t + (d.amount || 0), 0)

export type Tone = 'aman' | 'waspada' | 'bahaya'
export const toneText: Record<Tone, string> = { aman: 'text-aman', waspada: 'text-waspada', bahaya: 'text-bahaya' }

export function budgetStatus(spent: number, limit: number): { pct: number, tone: Tone, message: string } {
    const pct = limit > 0 ? (spent / limit) * 100 : spent > 0 ? 100 : 0
    const tone: Tone = pct < 30 ? 'aman' : pct < 80 ? 'waspada' : 'bahaya'
    const message = pct < 30 ? 'Ayo jajan' : pct < 60 ? 'Jajan dulu lagi gk sih' : pct < 80 ? 'Dikit lagi' : pct < 100 ? 'Waduh' : 'JAJAN TEROS'
    return { pct, tone, message }
}
