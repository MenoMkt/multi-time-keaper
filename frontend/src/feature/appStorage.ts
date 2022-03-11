import { useEffect } from "react";
import { Timer } from "../store/timer";

export type AppContext = {
  themeMode: "light" | "dark" | undefined;
  timers: Timer[];
};

export const useBackupApp = (
  colorMode: "light" | "dark",
  timerList: Timer[]
) => {
  const handler = () => {
    console.log("backup App Data");
    localStorage.setItem(
      "context",
      JSON.stringify({
        themeMode: colorMode,
        timers: timerList,
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
