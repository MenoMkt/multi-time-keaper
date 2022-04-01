import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Props = {
  title: string;
  onChange?: (value: string) => void;
};

function TitleForm(props: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(props.title);
  const [tmpTitle, setTmpTitle] = useState(props.title);
  const [isTitleEditMode, setTitleEditMode] = useState(false);
  const onChangeTitleEditMode = () => {
    console.log("onChangeTitleEditMode");
    if (isTitleEditMode) {
      setTitleEditMode((flg) => !flg);
      setTitle(tmpTitle);
      if (props.onChange) {
        props.onChange(tmpTitle);
      }
    } else {
      setTitleEditMode((flg) => !flg);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <TextField
        id="input-title"
        aria-label="input-title"
        autoFocus
        inputRef={titleRef}
        onKeyPress={(v) => {
          if (v.key === "Enter") {
            onChangeTitleEditMode();
          }
        }}
        value={tmpTitle}
        onChange={(v) => {
          setTmpTitle(v.target.value);
        }}
        sx={{
          width: "200px",
        }}
        style={!isTitleEditMode ? { display: "none" } : {}}
      />
      <Typography
        aria-label="title"
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
        {isTitleEditMode ? <CheckCircleIcon /> : <EditIcon />}
      </IconButton>
    </Box>
  );
}

TitleForm.propTypes = {
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default TitleForm;
