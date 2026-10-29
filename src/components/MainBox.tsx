import { Link } from "react-router-dom"
import { MainList } from '../redux/feature/main'
import { budgetStatus, formatRupiah, toneText } from "../lib/Formatter"
import { Meter } from "./Meter"

export const MainBox = ({ item, spent, handleClick }: { item: MainList, spent: number, handleClick: (item: MainList) => void }) => {
    const { tone, message } = budgetStatus(spent, item.limit)
    const sisa = item.limit - spent

    return (
        <li className="relative py-4">
            <Link to={`/detail?id=${item.id}`} className="block rounded-lg pr-10">
                <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-lg font-semibold">{item.title}</span>
                    <span className={`shrink-0 font-semibold ${sisa < 0 ? 'text-bahaya' : ''}`}>
                        {sisa < 0 ? `-Rp${formatRupiah(-sisa)}` : `Rp${formatRupiah(sisa)}`}
                    </span>
                </div>
                <div className="mt-2"><Meter spent={spent} limit={item.limit} /></div>
                <div className="mt-1.5 flex justify-between text-sm text-redup">
                    <span className={toneText[tone]}>{message}</span>
                    <span>{formatRupiah(spent)} / {formatRupiah(item.limit)}</span>
                </div>
            </Link>
            <button
                onClick={() => handleClick(item)} aria-label={`Hapus budget ${item.title}`}
                className="absolute right-0 top-3 rounded-lg p-2 text-redup hover:text-bahaya"
            >
                <TrashIcon />
            </button>
        </li>
    )
}

export const TrashIcon = () => (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
)
