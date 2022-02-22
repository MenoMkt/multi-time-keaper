import React, { useEffect, useState } from "react";
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

type Props = {
  title: string;
};

const TimerCard = (props: Props) => {
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState(props.title);

  useEffect(() => {
    console.log(time);
    console.log(typeof time);
  }, [time]);
  return (
    <div className="TimerCard">
      <Card sx={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              pl: 1,
              pb: 1,
            }}
          >
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                Title
              </Typography>
            </CardContent>

            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="play/pause">
                <PlayArrowIcon />
                <PauseIcon />
              </IconButton>
              <IconButton aria-label="reset">
                <ReplayIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
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
          </Box>
        </Box>

        {/*  */}
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
