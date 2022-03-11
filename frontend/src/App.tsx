import React, { useEffect, useState } from "react";
import "./App.scss";
import { Box, Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TimerCard from "./component/Card";
import Header from "./component/Header";
import { ulid } from "ulid";
import dayjs from "dayjs";
import { useBackupApp } from "./feature/appStorage";
import { Timer } from "./store/timer";
import { useSelector, useDispatch } from "react-redux";
import { addNewTimer, removeTimer } from "./store/timer";
import { RootState } from "./store";

export const ColorModeContext = React.createContext({
  toggleColorMode: (mode?: "dark" | "light") => {},
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [colorMode, setColorMode] = React.useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );
  const colorModeContext = {
    toggleColorMode: (mode?: "dark" | "light") => {
      if (mode) {
        setColorMode(mode);
      } else {
        setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      }
    },
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode]
  );
  const timerState = useSelector((state: RootState) => state.timer);
  const dispatch = useDispatch();
  // useBackupApp(colorMode, timerList);
  useEffect(() => {
    // Notification API 初期化
    if (!Notification) {
      console.log(`Browser not support Notification API`);
    }

    const permission = window.Notification.permission;
    if (permission === "default") {
      Notification.requestPermission().then(console.log);
    }

    // タイマーリストが0の場合初期化
    dispatch(addNewTimer());
  }, []);

  const addTimer = () => {
    console.log(`addTimer ${timerState.length + 1}`);
    dispatch(addNewTimer());
  };
  const deleteTimer = (id: string) => {
    dispatch(removeTimer(id));
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorModeContext}>
          <Header onAddTimer={addTimer} />
        </ColorModeContext.Provider>
        <main>
          <Container fixed>
            {Object.keys(timerState.timers).map((id) => {
              return (
                <Box
                  key={id}
                  sx={{
                    mb: 2,
                  }}
                >
                  <TimerCard
                    title={timerState.timers[id].title}
                    key={id}
                    onDelete={() => deleteTimer(id)}
                  ></TimerCard>
                </Box>
              );
            })}
          </Container>
        </main>
        <footer></footer>
      </ThemeProvider>
    </div>
  );
}

export default App;
