import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { ulid } from "ulid";

export type Timer = {
  id: string;
  title: string;
  hour: number;
  minute: number;
};

export type TimerState = {
  timers: Record<string, Timer>;
  length: number;
};

const initialState: TimerState = {
  timers: {},
  length: 0,
};
export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    addNewTimer: (state) => {
      console.log("addNewTimer");
      const id = ulid();
      const number = Object.keys(state.timers).length + 1;
      const date = dayjs().add(1, "h");
      state.timers[id] = {
        id: id,
        title: `timer${number}`,
        hour: date.get("h"),
        minute: date.get("minute"),
      };
      state.length = Object.keys(state.timers).length;
    },
    addTimer: (state, action: PayloadAction<Timer>) => {
      console.log(action);
      state.timers[action.payload.id] = action.payload;
      state.length = Object.keys(state.timers).length;
    },
    removeTimer: (state, action: PayloadAction<string>) => {
      console.log(action);
      delete state.timers[action.payload];
      state.length = Object.keys(state.timers).length;
    },
    updateTitle: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
      }>
    ) => {
      console.log(action);
      state.timers[action.payload.id].title = action.payload.title;
    },
    updateTimer: (
      state,
      action: PayloadAction<{
        id: string;
        date: number;
      }>
    ) => {
      console.log(action);
      const date = action.payload.date;
      state.timers[action.payload.id].hour = dayjs(date).get("h");
      state.timers[action.payload.id].minute = dayjs(date).get("minute");
    },
  },
});

// Action creators are generated for each case reducer function
export const { addNewTimer, addTimer, removeTimer, updateTimer, updateTitle } =
  timerSlice.actions;

export default timerSlice.reducer;
