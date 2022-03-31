import { configureStore } from "@reduxjs/toolkit";
import timerReducer, { getBackupTimer, TimerState } from "./store/timer";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
  },
  preloadedState: {
    timer: getBackupTimer(),
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
