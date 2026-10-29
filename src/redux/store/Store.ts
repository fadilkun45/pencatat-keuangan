import { AnyAction, Middleware, configureStore } from '@reduxjs/toolkit'
import mainListReducer, { deleteList } from "../feature/main"
import detailReducer, { addDetail, deleteDetail } from '../feature/detail'
import { load } from '../../lib/storage'
import { enqueue, flush, toAddOp } from '../../lib/sync'

type State = { mainList: ReturnType<typeof mainListReducer>, detail: ReturnType<typeof detailReducer> }

// Every change that should reach the Sheet passes through here, so pages don't have to remember it.
const syncMiddleware: Middleware<object, State> = (api) => (next) => (action: AnyAction) => {
    const before = api.getState()
    const result: unknown = next(action)
    if (addDetail.match(action)) {
        const kategori = before.mainList.find((c) => c.id === action.payload.id)?.title ?? ""
        enqueue([toAddOp(action.payload, kategori)])
    } else if (deleteDetail.match(action)) {
        enqueue([{ op: "delete", uid: action.payload.uid }])
    } else if (deleteList.match(action)) {
        enqueue((before.detail[action.payload] ?? []).map((d) => ({ op: "delete" as const, uid: d.uid })))
    }
    return result
}

export function makeStore(preloadedState: State = load()) {
    const store = configureStore({
        reducer: { mainList: mainListReducer, detail: detailReducer },
        preloadedState,
        middleware: (getDefault) => getDefault().concat(syncMiddleware),
    })

    // Persist only what changed; Immer keeps untouched arrays referentially equal.
    let prev = store.getState()
    store.subscribe(() => {
        const next = store.getState()
        if (next.mainList !== prev.mainList) localStorage.setItem("MainList", JSON.stringify(next.mainList))
        if (next.detail !== prev.detail) {
            for (const id of new Set([...Object.keys(prev.detail), ...Object.keys(next.detail)])) {
                if (next.detail[id] === prev.detail[id]) continue
                if (next.detail[id]) localStorage.setItem(id, JSON.stringify(next.detail[id]))
                else localStorage.removeItem(id)
            }
        }
        prev = next
    })
    return store
}

export const store = makeStore()
void flush() // send anything left over from last session

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
