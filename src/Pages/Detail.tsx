import { FormEvent, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store/Store'
import { addDetail, deleteDetail, Detail } from '../redux/feature/detail'
import { budgetStatus, formatRupiah, onlyNumber, sumAmount, toneText } from '../lib/Formatter'
import { newId } from '../lib/storage'
import { DetailCard } from '../components/DetailCard'
import { Meter } from '../components/Meter'

export const Detailpage = () => {
    const [search] = useSearchParams()
    const id = search.get('id') ?? ''
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState("")
    const titleRef = useRef<HTMLInputElement>(null)

    const parent = useSelector((state: RootState) => state.mainList.find((x) => x.id === id))
    const list = useSelector((state: RootState) => state.detail[id])
    const dispatch = useDispatch()

    if (!parent) {
        return <p className="text-redup">Budget ini sudah tidak ada. <Link className="font-semibold text-tinta underline" to="/">Kembali ke daftar</Link></p>
    }

    const spent = sumAmount(list)
    const sisa = parent.limit - spent
    const { tone, message } = budgetStatus(spent, parent.limit)

    const submit = (e: FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !amount) return setError("Isi nama dan nominal dulu.")
        dispatch(addDetail({ uid: newId(), id, title: title.trim(), amount, createdAt: new Date().toISOString() }))
        setTitle(""); setAmount(0); setError("")
        titleRef.current?.focus() // ready for the next entry
    }

    const remove = (item: Detail) => dispatch(deleteDetail(item))

    return (
        <main className="pb-40">
            <Link to="/" className="text-sm font-medium text-redup hover:text-tinta">← Semua budget</Link>
            <h1 className="mt-2 text-2xl font-bold">{parent.title}</h1>

            <section aria-label="Sisa budget" className="mt-4">
                <p className={`text-5xl font-bold tracking-tight ${sisa < 0 ? 'text-bahaya' : ''}`}>
                    {sisa < 0 ? '-' : ''}Rp{formatRupiah(Math.abs(sisa))}
                </p>
                <p className="text-redup">{sisa < 0 ? 'lewat dari limit' : 'masih bisa dipakai'}</p>
                <div className="mt-4"><Meter spent={spent} limit={parent.limit} thick /></div>
                <div className="mt-2 flex justify-between text-sm">
                    <span className={`font-semibold ${toneText[tone]}`}>{message}</span>
                    <span className="text-redup">{formatRupiah(spent)} / {formatRupiah(parent.limit)}</span>
                </div>
            </section>

            {list?.length ? (
                <ul className="mt-6 divide-y divide-garis">
                    {[...list].reverse().map((item) => <DetailCard key={item.uid} item={item} handleClick={remove} />)}
                </ul>
            ) : (
                <p className="mt-8 text-redup">Belum ada pengeluaran. Catat yang pertama di bawah.</p>
            )}

            {/* Pinned to the bottom so logging is one thumb away. */}
            <form onSubmit={submit} className="fixed inset-x-0 bottom-0 border-t border-garis bg-kertas/95 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="mx-auto max-w-md px-4 pt-3">
                    {error && <p className="mb-2 text-sm text-bahaya" role="alert">{error}</p>}
                    <div className="flex gap-2">
                        <input ref={titleRef} className="field" aria-label="Nama pengeluaran" placeholder="Kopi, parkir…" value={title} onChange={(e) => setTitle(e.target.value)} enterKeyHint="next" />
                        <input className="field w-32 shrink-0" aria-label="Nominal" inputMode="numeric" placeholder="Rp" enterKeyHint="done"
                            value={amount ? formatRupiah(amount) : ""} onChange={(e) => setAmount(onlyNumber(e.target.value))} />
                        <button className="btn shrink-0">Catat</button>
                    </div>
                </div>
            </form>
        </main>
    )
}
