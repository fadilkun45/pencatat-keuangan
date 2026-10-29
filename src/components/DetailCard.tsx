import { Detail } from '../redux/feature/detail'
import { formatRupiah, formatTanggal } from '../lib/Formatter'
import { TrashIcon } from './MainBox'

export const DetailCard = ({ item, handleClick }: { item: Detail, handleClick: (item: Detail) => void }) => (
  <li className="flex items-center gap-3 py-3">
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium">{item.title}</p>
      <p className="text-sm text-redup">{formatTanggal(item.createdAt)}</p>
    </div>
    <span className="font-semibold">Rp{formatRupiah(item.amount)}</span>
    <button onClick={() => handleClick(item)} aria-label={`Hapus ${item.title}`} className="rounded-lg p-2 text-redup hover:text-bahaya">
      <TrashIcon />
    </button>
  </li>
)
