/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import cloneDeep from "lodash.clonedeep"

export interface Detail {
    title?: string,
    amount?: number,
    createdAt?: string,
    id?: string,
    index?: number
}

const initialState: Detail[] = [

]

export const detailSlice = createSlice({
    name: "detail",
    initialState,
    reducers: {
        getDetail: (state, action: PayloadAction<Detail>) => {

            state.length = 0


            if (state.length !== 0) {
                return
            }


            if (JSON.parse(localStorage.getItem(action.payload.id!) ?? '{}') === null || Object.keys(JSON.parse(localStorage.getItem(action.payload.id!) ?? '{}')).length === 0) {
                return
            }

            state.push(...JSON.parse(localStorage.getItem(action.payload.id!) ?? '{}'))
            
            state.reverse()

        },

        addDetail: (state, action: PayloadAction<Detail>) => {
            state.reverse()
            localStorage.setItem(action.payload.id!, JSON.stringify([...state, action.payload]))
            state.push(action.payload)
        },

        deleteDetail: (state, action: PayloadAction<Detail>) => {
            // state.reverse()
            let oldState = cloneDeep(state)
            oldState.splice(action.payload.index!, 1)
            // console.log("baru",filtered)
            oldState.reverse()

            console.log("delete",oldState)

            localStorage.setItem(action.payload.id!, JSON.stringify([...oldState]))
            state = [...oldState]
        }
    },

})

export const { getDetail, addDetail, deleteDetail } = detailSlice.actions
export default detailSlice.reducer