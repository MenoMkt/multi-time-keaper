import React, { useEffect, useState } from "react";
import "./App.scss";
import { Container } from "@mui/material";
import TimerCard from "./component/Card";

function App() {
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
  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <Container fixed>
          <TimerCard></TimerCard>
        </Container>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
