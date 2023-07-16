import { PayloadAction, createSlice } from "@reduxjs/toolkit"

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
        getList: (state, action: PayloadAction<MainList>) => {
            if(state.length !== 0 ){
                return
            }
            state.push(...JSON.parse(localStorage.getItem("MainList")))
        },
        addList: (state, action: PayloadAction<MainList>) => {
            localStorage.setItem('MainList', JSON.stringify([...state, action.payload]))
            state.push(action.payload)
        }
    }
})

export const { addList, getList } = mainListSlice.actions

export default mainListSlice.reducer