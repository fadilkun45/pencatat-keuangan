import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// Stored as-is under localStorage "MainList" (oldest first). currentAmount is legacy:
// totals are now derived from the detail items so they can't drift.
export interface MainList {
    id: string,
    title: string,
    limit: number,
    createdAt: string,
    currentAmount?: number,
}

export const mainListSlice = createSlice({
    name: "mainList",
    initialState: [] as MainList[],
    reducers: {
        addList: (state, action: PayloadAction<MainList>) => { state.push(action.payload) },
        deleteList: (state, action: PayloadAction<string>) => state.filter((x) => x.id !== action.payload),
    }
})

export const { addList, deleteList } = mainListSlice.actions

export default mainListSlice.reducer
