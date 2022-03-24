import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  LinearProgress,
  Grid,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import Countdown, {
  CountdownRenderProps,
  CountdownApi,
  zeroPad,
} from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import {
  Timer,
  updateDate,
  updateTitle,
  updateInputMode,
  updateTime,
  TimeConfig,
} from "../../store/timer";
import { RootState } from "../../store";
import TimerForm from "./TimerForm";
import TitleForm from "./TitleForm";

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
  const onChangeStartPauseButton = () => {
    console.log("onChangeStartPauseButton");
    if (isRunning) {
      pauseTimer();
    } else {
      // タイマー有効化
      startTimer();
    }
  };

  const onChangeTimerForm = (value: TimeConfig) => {
    setCanStartTimer(
      dayjs()
        .set("h", value.date.hour)
        .set("m", value.date.minute)
        .isAfter(Date.now())
    );
    dispatch(
      updateInputMode({
        id: timer.id,
        mode: value.inputMode,
      })
    );
    dispatch(
      updateDate({
        id: timer.id,
        hour: value.date.hour,
        minute: value.date.minute,
      })
    );
    dispatch(
      updateTime({
        id: timer.id,
        time: value.remain.time,
        unit: value.remain.unit,
      })
    );
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <TitleForm
              title={timer.title}
              onChange={(title) => {
                dispatch(
                  updateTitle({
                    id: timer.id,
                    title,
                  })
                );
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TimerForm
              isRunning={isRunning}
              canStartTimer={canStartTimer}
              config={timer}
              onChange={onChangeTimerForm}
            />
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="play/pause"
                onClick={onChangeStartPauseButton}
                disabled={!canStartTimer}
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
  );
};

TimerCard.propTypes = {
  title: PropTypes.string,
};
TimerCard.defaultProps = {
  title: "timer",
};

export default TimerCard;
