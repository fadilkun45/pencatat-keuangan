/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface Detail {
    title?: string,
    amount?: number,
    createdAt?: string,
    id?: string
}

const initialState: Detail[] = [

]

export const detailSlice = createSlice({
    name: "detail",
    initialState,
    reducers: {
        getDetail: (state, action: PayloadAction<Detail>) => {
        if(state.length !== 0 || !action.payload.id ){
            return
        }
        state.push(...JSON.parse(localStorage.getItem(action.payload.id)))
        },
        addDetail: (state, action: PayloadAction<Detail>) => {
            localStorage.setItem(action.payload.id || '', JSON.stringify([...state, action.payload]))          
            state.push(action.payload)
        },
    },

})

export const { getDetail,addDetail } = detailSlice.actions
export default detailSlice.reducer