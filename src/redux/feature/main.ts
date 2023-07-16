/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { WritableDraft } from "immer/dist/internal.js"
import cloneDeep from "lodash.clonedeep"

export interface MainList {
    limit?: number,
    title?: string,
    currentAmount?: number,
    id?: string
}

const initialState: MainList[] = [

]

export const mainListSlice = createSlice({
    name: "mainList",
    initialState,
    reducers: {
        getList: (state) => {

            // console.log(JSON.parse(localStorage.getItem("MainList") ?? '{}'))

            state.length = 0

            if(state.length !== 0 ){
                return
            }

            if(JSON.parse(localStorage.getItem("MainList") ?? '{}') === null || Object.keys(JSON.parse(localStorage.getItem("MainList") ?? '{}')).length === 0){
                return
            }

            state.push(...JSON.parse(localStorage.getItem("MainList" || "") ?? '{}'))
        },
        addList: (state, action: PayloadAction<MainList>) => {
            localStorage.setItem('MainList', JSON.stringify([...state, action.payload]))
            state.push(action.payload)
        },
        editList: (state, action: PayloadAction<MainList>) => {
            // console.log("check payload",action.payload)
            let oldState = cloneDeep(state)
            let filtered: WritableDraft<MainList>[] = []
            oldState.map((v) => {
                if(v.id !== action.payload.id){
                    filtered.push(v)
                }
            })
            // console.log("baru",filtered)

            localStorage.setItem('MainList', JSON.stringify([...filtered, action.payload]))
            state = [...filtered, action.payload]
        },
        deleteList: (state, action: PayloadAction<MainList>) => {
            // console.log("check payload",action.payload)
            let oldState = cloneDeep(state)
            let filtered: WritableDraft<MainList>[] = []
            oldState.map((v) => {
                if(v.id !== action.payload.id){
                    filtered.push(v)
                }
            })
            // console.log("baru",filtered)
            localStorage.removeItem(action.payload.id || '')
            localStorage.setItem('MainList', JSON.stringify([...filtered]))
            state = [...filtered]
        }

    }
})

export const { addList, getList, editList, deleteList } = mainListSlice.actions

export default mainListSlice.reducer