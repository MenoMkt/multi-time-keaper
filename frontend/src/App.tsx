import React, { useEffect } from "react";
import "./App.scss";
import { Container, Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TimerCard from "./component/card/Card";
import Header from "./component/header/Header";
import { getAppContext, useBackupApp } from "./feature/appStorage";
import { useSelector, useDispatch } from "react-redux";
import { addNewTimer, removeTimer, initTimerList } from "./store/timer";
import { RootState } from "./store";

type ThemeMode = "light" | "dark";
export const ColorModeContext = React.createContext({
  toggleColorMode: (mode?: ThemeMode) => {},
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [colorMode, setColorMode] = React.useState<ThemeMode>(
    prefersDarkMode ? "dark" : "light"
  );
  const colorModeContext = {
    toggleColorMode: (mode?: ThemeMode) => {
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
  useBackupApp();
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
    const appContext = getAppContext();
    if (appContext && appContext.timer && appContext.timer.length) {
      dispatch(initTimerList(appContext.timer));
    } else {
      dispatch(addNewTimer());
    }
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorModeContext}>
          <Header onAddTimer={() => dispatch(addNewTimer())} />
        </ColorModeContext.Provider>
        <main>
          <Container fixed>
            <Grid container spacing={2}>
              {Object.keys(timerState.timers).map((id) => {
                return (
                  <Grid item sm={12} md={6} key={id}>
                    <TimerCard
                      title={timerState.timers[id].title}
                      key={id}
                      id={id}
                      onDelete={() => dispatch(removeTimer(id))}
                    ></TimerCard>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </main>
        <footer></footer>
      </ThemeProvider>
    </div>
  );
}

export default App;
