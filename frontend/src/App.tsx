import React, { useEffect, useState } from "react";
import "./App.scss";
import { Container } from "@mui/material";
import TimerCard from "./component/Card";
import Header from "./component/Header";

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
      <Header />
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
