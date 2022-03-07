import React, { useEffect, useState } from "react";
import "./App.scss";
import { Box, Container } from "@mui/material";
import TimerCard from "./component/Card";
import Header from "./component/Header";
import { ulid } from "ulid";
type TimerCardContext = {
  id: string;
  title: string;
};

function App() {
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
      <Header onAddTimer={addTimer} />
      <main>
        <Container fixed>
          {timerList.map((i) => {
            return (
              <Box
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
    </div>
  );
}

export default App;
