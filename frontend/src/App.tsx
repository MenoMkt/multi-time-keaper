import React, { useEffect, useState } from "react";
import "./App.scss";
import { Container } from "@mui/material";
import TimerCard from "./component/Card";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
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
      <AppBar position="static" sx={{ mb: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MultiTimeKeeper
          </Typography>
          <Tooltip title="タイマーを追加する" placement="bottom">
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <AddIcon fontSize="large"></AddIcon>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
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
