import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { deleteList } from "./main"

// Stored under localStorage key = category id (oldest first). `id` is the category id
// (legacy format, kept so old builds can still read the data); `uid` identifies the item.
export interface Detail {
    uid: string,
    id: string,
    title: string,
    amount: number,
    createdAt: string,
}

export const detailSlice = createSlice({
    name: "detail",
    initialState: {} as Record<string, Detail[]>,
    reducers: {
        addDetail: (state, action: PayloadAction<Detail>) => {
            (state[action.payload.id] ??= []).push(action.payload)
        },
        deleteDetail: (state, action: PayloadAction<Detail>) => {
            const { id, uid } = action.payload
            state[id] = (state[id] ?? []).filter((d) => d.uid !== uid)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(deleteList, (state, action) => { delete state[action.payload] })
    },
})

export const { addDetail, deleteDetail } = detailSlice.actions
export default detailSlice.reducer
