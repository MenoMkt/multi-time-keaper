import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import Countdown, {
  CountdownRenderProps,
  CountdownApi,
  zeroPad,
} from "react-countdown";
type Props = {
  title: string;
};

const TimerCard = (props: Props) => {
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState(props.title);
  const tmpTitle = useRef("");
  const [titleEditMode, setTitleEditMode] = useState(false);
  const [countdownDate, setCountdownDate] = useState(Date.now());
  const [running, setRunning] = useState(false);

  let countdownApi: CountdownApi | undefined = undefined;
  // Renderer callback with condition
  const countdownRender = ({
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    return (
      <Typography component="div" variant="h5" textAlign={"right"}>
        {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </Typography>
    );
  };

  const startTimer = () => {
    const timeDate = dayjs()
      .set("hour", time.getHours())
      .set("minute", time.getMinutes())
      .set("second", time.getSeconds());
    setCountdownDate(timeDate.valueOf());
    countdownApi?.start();
    setRunning(true);
  };
  const pauseTimer = () => {
    console.log("pause timer");
    setRunning(false);
    countdownApi?.pause();
    // setCountdownDate(Date.now());
  };
  const completeTimer = () => {
    console.log("on complete timer");
    timerAlert();
    setRunning(false);
  };

  /**
   * Notification APIで通知する
   */
  const timerAlert = () => {
    const n = new Notification(`${title} alert!`, {
      tag: title + Date.now().toString(),
    });
    n.onclick = () => {
      n.close();
    };
  };
  const onChangeTitleEditMode = () => {
    console.log("onChangeTitleEditMode");
    if (titleEditMode) {
      setTitleEditMode((flg) => !flg);
      setTitle(tmpTitle.current);
    } else {
      setTitleEditMode((flg) => !flg);
      tmpTitle.current = title;
    }
    console.log({
      title,
      tmp: tmpTitle.current,
    });
  };
  const onChangeStartPauseButton = () => {
    console.log("onChangeStartPauseButton");
    if (running) {
      pauseTimer();
    } else {
      // タイマー有効化
      startTimer();
    }
  };

  return (
    <div className="TimerCard">
      <Card
        sx={{
          width: "500px",
        }}
      >
        <CardContent
          sx={{
            alignItems: "flex-start",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextField
                id="title "
                label="title"
                defaultValue={title}
                inputRef={tmpTitle}
                onChange={(v) => {
                  tmpTitle.current = v.target.value;
                }}
                sx={{
                  width: "200px",
                }}
                style={!titleEditMode ? { display: "none" } : {}}
              />
              <Typography
                component="div"
                variant="h5"
                textAlign={"left"}
                sx={{
                  pl: 1,
                  pt: 2,
                  pb: 1,
                  width: "200px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                style={titleEditMode ? { display: "none" } : {}}
              >
                {title}
              </Typography>
              <IconButton
                aria-label="edit-title"
                onClick={onChangeTitleEditMode}
                sx={{
                  mt: 1,
                  mb: 1,
                }}
              >
                {titleEditMode ? <CheckCircleIcon /> : <EditIcon />}
              </IconButton>
            </Box>
            {/* タイマーコントロール */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="play/pause"
                onClick={onChangeStartPauseButton}
              >
                {running ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton aria-label="reset">
                <ReplayIcon />
              </IconButton>
            </Box>
          </Box>
          {/* 右側の要素 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              flexDirection: "column",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Basic example"
                ampm={false}
                value={time}
                onChange={(newValue) => {
                  if (newValue) {
                    setTime(newValue);
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Box sx={{ width: 1 }}>
              <Countdown
                date={countdownDate}
                renderer={countdownRender}
                ref={(ref) => {
                  countdownApi = ref?.getApi();
                }}
                onComplete={completeTimer}
                overtime={true}
                autoStart={false}
                zeroPadTime={3}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

TimerCard.propTypes = {
  title: PropTypes.string,
};
TimerCard.defaultProps = {
  title: "timer",
};

export default TimerCard;
