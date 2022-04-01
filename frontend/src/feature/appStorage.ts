import { useEffect } from "react";
import { Timer, TimerState } from "../store/timer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
export type AppContext = {
  // themeMode: "light" | "dark" | undefined;
  timer: TimerState;
};
const LOCAL_STORAGE_CONTEXT_KEY = "context";

export const getAppContext = (): Partial<AppContext> | null => {
  const value = localStorage.getItem(LOCAL_STORAGE_CONTEXT_KEY);
  return value ? (JSON.parse(value) as Partial<AppContext>) : null;
};
export const useBackupApp = () => {
  const timerState = useSelector((state: RootState) => state.timer);

  useEffect(() => {
    console.log("backup");
    localStorage.setItem(
      LOCAL_STORAGE_CONTEXT_KEY,
      JSON.stringify({
        timer: timerState,
      })
    );
  }, [timerState]);
};
