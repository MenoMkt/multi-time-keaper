import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { ulid } from "ulid";
import { getAppContext } from "../feature/appStorage";

export type Timer = {
  id: string;
  title: string;
} & TimeConfig;

export type TimeConfig = {
  inputMode: "date" | "remain";
  date: {
    hour: number;
    minute: number;
  };
  remain: {
    unit: "h" | "m" | "s";
    time: number;
  };
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
    initTimerList: (state, action: PayloadAction<TimerState>) => {
      state.timers = action.payload.timers;
      state.length = action.payload.length;
    },
    addNewTimer: (state) => {
      console.log("addNewTimer");
      const id = ulid();
      const number = Object.keys(state.timers).length + 1;
      const date = dayjs().add(1, "h");
      state.timers[id] = {
        id: id,
        title: `timer${number}`,
        inputMode: "date",
        date: {
          hour: date.get("h"),
          minute: date.get("minute"),
        },
        remain: {
          time: 1,
          unit: "h",
        },
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
    updateDate: (
      state,
      action: PayloadAction<{
        id: string;
        hour: number;
        minute: number;
      }>
    ) => {
      console.log(action);
      state.timers[action.payload.id].date.hour = action.payload.hour;
      state.timers[action.payload.id].date.minute = action.payload.minute;
    },
    updateTime: (
      state,
      action: PayloadAction<{
        id: string;
        time: number;
        unit: "h" | "m" | "s";
      }>
    ) => {
      console.log(action);
      state.timers[action.payload.id].remain = {
        time: action.payload.time,
        unit: action.payload.unit,
      };
    },
    updateInputMode: (
      state,
      action: PayloadAction<{
        id: string;
        mode: "date" | "remain";
      }>
    ) => {
      state.timers[action.payload.id].inputMode = action.payload.mode;
    },
  },
});

export const getBackupTimer = (): TimerState => {
  const backup = getAppContext();
  if (backup && backup.timer) {
    return backup.timer;
  } else {
    return {
      length: 0,
      timers: {},
    };
  }
};

// Action creators are generated for each case reducer function
export const {
  addNewTimer,
  addTimer,
  removeTimer,
  updateDate,
  updateTitle,
  initTimerList,
  updateInputMode,
  updateTime,
} = timerSlice.actions;

export default timerSlice.reducer;
