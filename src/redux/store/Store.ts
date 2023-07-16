import { configureStore } from '@reduxjs/toolkit'
import mainListReducer from "../feature/main"
import detailReducer from '../feature/detail'

export const store = configureStore({
  reducer: {
    mainList: mainListReducer,
    detail: detailReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch