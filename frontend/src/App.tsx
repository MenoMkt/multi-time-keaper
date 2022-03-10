import React, { useEffect, useState } from "react";
import "./App.scss";
import { Box, Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TimerCard from "./component/Card";
import Header from "./component/Header";
import { ulid } from "ulid";

type TimerCardContext = {
  id: string;
  title: string;
};

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

  const [timerList, setTimerList] = useState<TimerCardContext[]>([
    {
      id: ulid(),
      title: "timer1",
    },
  ]);
  useEffect(() => {
    // Notification API 初期化
    if (!Notification) {
      console.log(`Browser not support Notification API`);
    }

    const permission = window.Notification.permission;
    if (permission === "default") {
      Notification.requestPermission().then(console.log);
    }
  }, []);

  const addTimer = () => {
    console.log(`addTimer ${timerList.length + 1}`);
    setTimerList((list) => {
      return [
        ...list,
        {
          id: ulid(),
          title: `timer${list.length + 1}`,
        },
      ];
    });
  };
  const deleteTimer = (id: string) => {
    const newList = timerList.filter((i) => i.id !== id);
    setTimerList(newList);
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorModeContext}>
          <Header onAddTimer={addTimer} />
        </ColorModeContext.Provider>
        <main>
          <Container fixed>
            {timerList.map((i) => {
              return (
                <Box
                  key={i.id}
                  sx={{
                    mb: 2,
                  }}
                >
                  <TimerCard
                    title={i.title}
                    key={i.id}
                    onDelete={() => deleteTimer(i.id)}
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
