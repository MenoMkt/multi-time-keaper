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
  const handler = () => {
    console.log("backup App Data");
    localStorage.setItem(
      LOCAL_STORAGE_CONTEXT_KEY,
      JSON.stringify({
        timer: timerState,
      })
    );
  };
  useEffect(() => {
    if (window) {
      window.addEventListener("visibilitychange", (event) => {
        if ((event.target as Document).visibilityState === "hidden") {
          handler();
        }
      });
      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("visibilitychange", handler);
        window.removeEventListener("beforeunload", handler);
      };
    }
  });
};
