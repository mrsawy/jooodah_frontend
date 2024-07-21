import React from "react";
import PropTypes from "prop-types";

import {
  Input,
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
} from "semantic-ui-react";

import TextField from "@mui/material/TextField";

function NumericInput({ value, label, onChange, placeholder, className }) {
  const handleInputChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    event.target.value = value;
  };
  return (
    <Input
      className={className}
      value={value}
      placeholder={placeholder ? placeholder : ``}
      label={label}
      type="text" // Use type="text" to allow custom input handling
      inputProps={{
        pattern: "[0-9]*", // Use the pattern attribute for better mobile support
      }}
      onChange={(e) => {
        handleInputChange(e);
        if (onChange && typeof onChange == `function`) {
          onChange(e);
        }
      }}
    />
  );
}

NumericInput.propTypes = {
  label: PropTypes.string.isRequired,
};
export default NumericInput;
