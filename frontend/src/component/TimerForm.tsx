import {
  Alert,
  Box,
  Collapse,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TimeConfig } from "../store/timer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import dayjs from "dayjs";

type Props = {
  isRunning: boolean;
  canStartTimer: boolean;
  config: TimeConfig;
  onChange?: (value: TimeConfig) => void;
};

const TimerForm = (props: Props) => {
  const [timer, setTimer] = useState<TimeConfig>(props.config);
  useEffect(() => {
    if (props.onChange) {
      props.onChange(timer);
    }
    // 無限ループになるため
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

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
          disabled={props.isRunning}
          checked={timer.inputMode === "remain"}
          onChange={(e, checked) => {
            setTimer((v) => ({
              ...v,
              inputMode: checked ? "remain" : "date",
            }));
          }}
        />
        <AccessTimeIcon fontSize="small" />
      </Box>
    );
  };
  return (
    <Box>
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
                  setTimer((v) => ({
                    ...v,
                    date: {
                      hour: dayjs(newValue).get("h"),
                      minute: dayjs(newValue).get("m"),
                    },
                  }));
                }
              }}
              readOnly={props.isRunning}
              renderInput={(params) => <TextField {...params} />}
            />
            <Collapse in={!props.canStartTimer}>
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
                readOnly: props.isRunning,
              }}
              value={timer.remain.time}
              onChange={(e) => {
                setTimer((v) => ({
                  ...v,
                  remain: {
                    time: Number(e.target.value),
                    unit: v.remain.unit,
                  },
                }));
              }}
            />
            <Select
              id="time-input-unit"
              value={timer.remain.unit}
              readOnly={props.isRunning}
              onChange={(val) => {
                setTimer((v) => ({
                  ...v,
                  remain: {
                    time: v.remain.time,
                    unit: val.target.value as "h" | "m" | "s",
                  },
                }));
              }}
            >
              <MenuItem value={"h"}>h</MenuItem>
              <MenuItem value={"m"}>m</MenuItem>
              <MenuItem value={"s"}>s</MenuItem>
            </Select>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TimerForm;
