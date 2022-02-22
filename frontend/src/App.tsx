import React, { useEffect, useState } from "react";
import "./App.scss";
import { Container } from "@mui/material";
import TimerCard from "./component/Card";

function App() {
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
