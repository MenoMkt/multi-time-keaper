import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import React from "react";
import { ColorModeContext } from "../App";

type Props = {
  onAddTimer?: () => void;
};
const Header = (props: Props) => {
  const colorMode = React.useContext(ColorModeContext);
  const onChangeDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    colorMode.toggleColorMode(event.target.checked ? "dark" : "light");
  };

  return (
    <AppBar position="sticky" sx={{ mb: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MultiTimeKeeper
        </Typography>
        <FormControlLabel
          control={<Switch onChange={onChangeDarkMode} />}
          label="ダークモード"
        />
        <Tooltip title="タイマーを追加する" placement="bottom">
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={props.onAddTimer}
          >
            <AddIcon fontSize="large"></AddIcon>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
