import { FormEvent, useEffect, useState, useSyncExternalStore } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store/Store"
import { flush, getSheetUrl, getSyncStatus, setSheetUrl, subscribeSync, toAddOp } from "../lib/sync"

type InstallPrompt = Event & { prompt: () => Promise<void> }

export const Navbar = () => {
  const [promptInstall, setPromptInstall] = useState<InstallPrompt>()
  const [open, setOpen] = useState(false)
  const sync = useSyncExternalStore(subscribeSync, getSyncStatus)
  const connected = !!getSheetUrl()

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setPromptInstall(e as InstallPrompt) }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const dot = !connected ? 'bg-garis' : sync.error ? 'bg-bahaya' : sync.pending ? 'bg-waspada' : 'bg-aman'

  return (
    <header className="mb-6">
      <div className="flex items-center gap-2">
        <Link to="/" className="mr-auto text-xl font-bold tracking-tight">Pencatat Keuangan</Link>
        {promptInstall && (
          <button onClick={() => void promptInstall.prompt()} className="rounded-lg px-3 py-2 text-sm font-medium text-redup hover:text-tinta">
            Pasang app
          </button>
        )}
        <button
          onClick={() => setOpen(!open)} aria-expanded={open}
          className="flex items-center gap-2 rounded-lg border border-garis bg-permukaan px-3 py-2 text-sm font-medium"
        >
          <span className={`size-2 rounded-full ${dot}`} aria-hidden />
          Sheet
          {sync.pending > 0 && <span className="rounded-full bg-waspada px-1.5 text-xs text-kertas" aria-label={`${sync.pending} belum terkirim`}>{sync.pending}</span>}
        </button>
      </div>
      {open && <SheetPanel sync={sync} connected={connected} />}
    </header>
  )
}

const SheetPanel = ({ sync, connected }: { sync: ReturnType<typeof getSyncStatus>, connected: boolean }) => {
  const [url, setUrl] = useState(getSheetUrl())
  const [error, setError] = useState("")
  const state = useSelector((s: RootState) => s)

  const save = (e: FormEvent) => {
    e.preventDefault()
    const all = state.mainList.flatMap((c) => (state.detail[c.id] ?? []).map((d) => toAddOp(d, c.title)))
    try { setSheetUrl(url, all); setError("") } catch (err) { setError((err as Error).message) }
  }

  return (
    <form onSubmit={save} className="mt-3 space-y-3 rounded-xl border border-garis bg-permukaan p-4">
      <label className="block text-sm font-medium" htmlFor="sheet-url">Link web app Google Sheet</label>
      <input id="sheet-url" className="field" placeholder="https://script.google.com/macros/s/…/exec" value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" />
      <p className="text-sm text-redup">
        Cara bikin linknya ada di README, bagian "Hubungkan ke Google Sheet". Saat disimpan, semua catatan yang sudah ada ikut dikirim.
      </p>
      {(error || sync.error) && <p className="text-sm text-bahaya" role="alert">{error || `Gagal kirim: ${sync.error}. Dicoba lagi saat online atau tekan Kirim sekarang.`}</p>}
      <div className="flex items-center gap-2">
        <button className="btn">Simpan link</button>
        {connected && sync.pending > 0 && (
          <button type="button" onClick={() => void flush()} disabled={sync.sending} className="rounded-lg px-3 py-2.5 font-medium">
            {sync.sending ? "Mengirim…" : "Kirim sekarang"}
          </button>
        )}
        <span className="ml-auto text-sm text-redup">
          {!connected ? "Belum terhubung" : sync.pending ? `${sync.pending} belum terkirim` : "Semua terkirim"}
        </span>
      </div>
    </form>
  )
}
