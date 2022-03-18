import React, { useRef, useState } from "react";
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
  LinearProgress,
  Alert,
  Collapse,
  Select,
  MenuItem,
  Switch,
  Grid,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import Countdown, {
  CountdownRenderProps,
  CountdownApi,
  zeroPad,
} from "react-countdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useDispatch, useSelector } from "react-redux";
import {
  Timer,
  updateDate,
  updateTitle,
  updateInputMode,
  updateTime,
} from "../store/timer";
import { RootState } from "../store";

type Props = {
  id: string;
  title: string;
  onDelete?: () => void;
};
type Progress = {
  value: number;
  startDate: number;
  endDate: number;
};

const TimerCard = (props: Props) => {
  const tmpTitle = useRef("");
  const [isTitleEditMode, setTitleEditMode] = useState(false);
  const [canStartTimer, setCanStartTimer] = useState(true);
  const [countdownDate, setCountdownDate] = useState(Date.now());
  const [isRunning, setRunning] = useState(false);
  const [progress, setProgress] = useState<Progress>({
    value: 0,
    startDate: Date.now(),
    endDate: Date.now(),
  });
  const timer: Timer = useSelector(
    (state: RootState) => state.timer.timers[props.id]
  );
  const dispatch = useDispatch();

  let countdownApi: CountdownApi | undefined = undefined;
  // Renderer callback with condition
  const countdownRender = ({
    days,
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
    const timeDate =
      timer.inputMode === "date"
        ? dayjs().set("hour", timer.date.hour).set("minute", timer.date.minute)
        : dayjs().add(timer.remain.time, timer.remain.unit);
    setCountdownDate(timeDate.valueOf());
    setProgress({
      value: 0,
      startDate: Date.now(),
      endDate: timeDate.valueOf(),
    });
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
    countdownApi?.stop();
    // TODO:タイマー終了時に残り時間を00:00:00にしたいが、カウントダウンの日時を設定すると再度アラートが発火する
    // setCountdownDate(Date.now());
  };
  const onCountdownTick = () => {
    setProgress((state) => ({
      ...state,
      value:
        ((Date.now() - state.startDate) * 100) /
        (state.endDate - state.startDate),
    }));
  };
  /**
   * Notification APIで通知する
   */
  const timerAlert = () => {
    const n = new Notification(`${timer.title} alert!`, {
      tag: timer.title + Date.now().toString(),
    });
    n.onclick = () => {
      n.close();
    };
  };
  const onChangeTitleEditMode = () => {
    console.log("onChangeTitleEditMode");
    if (isTitleEditMode) {
      setTitleEditMode((flg) => !flg);
      dispatch(updateTitle({ id: props.id, title: tmpTitle.current }));
    } else {
      setTitleEditMode((flg) => !flg);
      tmpTitle.current = timer.title;
    }
  };
  const onChangeStartPauseButton = () => {
    console.log("onChangeStartPauseButton");
    if (isRunning) {
      pauseTimer();
    } else {
      // タイマー有効化
      startTimer();
    }
  };

  const InputModeToggleButton = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <CalendarTodayIcon fontSize="small" />
        <Switch
          name="time-set-toggle"
          disabled={isRunning}
          checked={timer.inputMode === "remain"}
          onChange={(e, checked) => {
            dispatch(
              updateInputMode({
                id: timer.id,
                mode: checked ? "remain" : "date",
              })
            );
          }}
        />
        <AccessTimeIcon fontSize="small" />
      </Box>
    );
  };
  return (
    <div className="TimerCard">
      <Card
        sx={{
          width: "500px",
        }}
      >
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <TextField
                  id="title "
                  label="title"
                  defaultValue={timer.title}
                  inputRef={tmpTitle}
                  onChange={(v) => {
                    tmpTitle.current = v.target.value;
                  }}
                  sx={{
                    width: "200px",
                  }}
                  style={!isTitleEditMode ? { display: "none" } : {}}
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
                  style={isTitleEditMode ? { display: "none" } : {}}
                >
                  {timer.title}
                </Typography>
                <IconButton
                  aria-label="edit-title"
                  onClick={onChangeTitleEditMode}
                  sx={{
                    mt: 1,
                    mb: 1,
                  }}
                  disabled={isRunning}
                >
                  {isTitleEditMode ? <CheckCircleIcon /> : <EditIcon />}
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <InputModeToggleButton />
              {timer.inputMode === "date" ? (
                // 日時指定
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      ampm={false}
                      value={dayjs()
                        .set("h", timer.date.hour)
                        .set("minute", timer.date.minute)}
                      onChange={(newValue) => {
                        if (newValue) {
                          setCanStartTimer(dayjs().isBefore(newValue));
                          dispatch(
                            updateDate({
                              id: props.id,
                              date: newValue.valueOf(),
                            })
                          );
                        }
                      }}
                      readOnly={isRunning}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <Collapse in={!canStartTimer}>
                      <Alert severity="warning">
                        現在時刻より先の時間に設定してください。
                      </Alert>
                    </Collapse>
                  </LocalizationProvider>
                </Box>
              ) : (
                // 時間指定
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "row",
                    }}
                  >
                    <TextField
                      id="time-input"
                      label="時間"
                      inputProps={{
                        readOnly: isRunning,
                      }}
                      value={timer.remain.time}
                      onChange={(e) => {
                        dispatch(
                          updateTime({
                            id: timer.id,
                            time: Number(e.target.value),
                            unit: timer.remain.unit,
                          })
                        );
                      }}
                    />
                    <Select
                      id="time-input-unit"
                      value={timer.remain.unit}
                      readOnly={isRunning}
                      onChange={(val) => {
                        dispatch(
                          updateTime({
                            id: timer.id,
                            time: timer.remain.time,
                            unit: val.target.value as "h" | "m" | "s",
                          })
                        );
                      }}
                    >
                      <MenuItem value={"h"}>h</MenuItem>
                      <MenuItem value={"m"}>m</MenuItem>
                      <MenuItem value={"s"}>s</MenuItem>
                    </Select>
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label="play/pause"
                  onClick={onChangeStartPauseButton}
                  disabled={isTitleEditMode || !canStartTimer}
                >
                  {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton aria-label="reset" onClick={props.onDelete}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ width: 1 }}>
                <Countdown
                  date={countdownDate}
                  renderer={countdownRender}
                  ref={(ref) => {
                    countdownApi = ref?.getApi();
                  }}
                  onComplete={completeTimer}
                  onTick={onCountdownTick}
                  overtime={true}
                  autoStart={false}
                  zeroPadTime={2}
                  daysInHours={true}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 1,
                  ml: 1,
                  mr: 1,
                }}
              >
                <LinearProgress variant="determinate" value={progress.value} />
              </Box>
            </Grid>
          </Grid>
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
