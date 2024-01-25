/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { WritableDraft } from "immer/dist/internal.js"
import cloneDeep from "lodash.clonedeep"

export interface MainList {
    limit?: number,
    title?: string,
    currentAmount?: number,
    id?: string,
    createdAt?: string
}

const initialState: MainList[] = [

]

export const mainListSlice = createSlice({
    name: "mainList",
    initialState,
    reducers: {
        getList: (state) => {

            state.length = 0

            if (state.length !== 0) {
                return
            }

            if (JSON.parse(localStorage.getItem("MainList") ?? '{}') === null || Object.keys(JSON.parse(localStorage.getItem("MainList") ?? '{}')).length === 0) {
                return
            }

            state.push(...JSON.parse(localStorage.getItem("MainList" || "") ?? '{}'))
            state.reverse()
        },
        addList: (state, action: PayloadAction<MainList>) => {
            state.reverse()
            localStorage.setItem('MainList', JSON.stringify([...state, action.payload]))
            state.push(action.payload)
        },
        editList: (state, action: PayloadAction<MainList>) => {

            state.reverse()
            let oldState = cloneDeep(state)
            let filtered: WritableDraft<MainList>[] = []
            oldState.map((v) => {
                if (v.id !== action.payload.id) {
                    filtered.push(v)
                } else {
                    filtered.push(action.payload)
                }
            })

            localStorage.setItem('MainList', JSON.stringify(filtered))

            state = [...filtered, action.payload]
        },
        deleteList: (state, action: PayloadAction<MainList>) => {
            state.reverse()

            let oldState = cloneDeep(state)
            let filtered: WritableDraft<MainList>[] = []
            oldState.map((v) => {
                if (v.id !== action.payload.id) {
                    filtered.push(v)
                }
            })

            localStorage.removeItem(action.payload.id || '')
            localStorage.setItem('MainList', JSON.stringify([...filtered]))
            state = [...filtered]
        },

    }
})

export const { addList, getList, editList, deleteList } = mainListSlice.actions

export default mainListSlice.reducer