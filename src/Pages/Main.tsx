import { FormEvent, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from "../redux/store/Store"
import { addList, deleteList, MainList } from "../redux/feature/main"
import { MainBox } from "../components/MainBox"
import { Meter } from "../components/Meter"
import { formatRupiah, onlyNumber, sumAmount } from "../lib/Formatter"
import { newId } from "../lib/storage"

export const Main = () => {
    const [title, setTitle] = useState("")
    const [limit, setLimit] = useState(0)
    const [error, setError] = useState("")
    const list = useSelector((state: RootState) => state.mainList)
    const detail = useSelector((state: RootState) => state.detail)
    const dispatch = useDispatch()

    const spentOf = (id: string) => sumAmount(detail[id])
    const totalLimit = list.reduce((t, c) => t + c.limit, 0)
    const totalSpent = list.reduce((t, c) => t + spentOf(c.id), 0)

    const submit = (e: FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !limit) return setError("Isi nama dan limit budget dulu.")
        dispatch(addList({ id: newId(), title: title.trim(), limit, createdAt: new Date().toISOString() }))
        setTitle(""); setLimit(0); setError("")
    }

    const remove = (item: MainList) => {
        if (confirm(`Hapus budget "${item.title}" beserta semua catatannya?`)) dispatch(deleteList(item.id))
    }

    return (
        <main className="pb-10">
            {list.length > 0 && (
                <section aria-label="Ringkasan" className="mb-8">
                    <p className="text-redup">Sisa dari semua budget</p>
                    <p className={`text-5xl font-bold tracking-tight ${totalLimit - totalSpent < 0 ? 'text-bahaya' : ''}`}>
                        Rp{formatRupiah(totalLimit - totalSpent)}
                    </p>
                    <div className="mt-4"><Meter spent={totalSpent} limit={totalLimit} thick /></div>
                    <p className="mt-2 text-sm text-redup">Terpakai Rp{formatRupiah(totalSpent)} dari Rp{formatRupiah(totalLimit)}</p>
                </section>
            )}

            <form onSubmit={submit} className="rounded-xl border border-garis bg-permukaan p-4">
                <h2 className="mb-3 font-semibold">{list.length ? "Tambah budget" : "Mulai dengan budget pertamamu"}</h2>
                <div className="flex gap-2">
                    <input className="field" aria-label="Nama budget" placeholder="Makan, bensin…" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input className="field w-36 shrink-0" aria-label="Limit" inputMode="numeric" placeholder="Limit"
                        value={limit ? formatRupiah(limit) : ""} onChange={(e) => setLimit(onlyNumber(e.target.value))} />
                </div>
                {error && <p className="mt-2 text-sm text-bahaya" role="alert">{error}</p>}
                <button className="btn mt-3 w-full">Tambah budget</button>
            </form>

            <ul className="mt-4 divide-y divide-garis">
                {[...list].reverse().map((item) => (
                    <MainBox key={item.id} item={item} spent={spentOf(item.id)} handleClick={remove} />
                ))}
            </ul>
        </main>
    )
}
