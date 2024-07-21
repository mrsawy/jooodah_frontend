import React from "react";
import classes from "./spinner.module.css";

function Spinner({ className }) {
  return (
    <div className={"flex justify-center items-center w-full " + className}>
      <div class={classes["loader"]}></div>
    </div>
  );
}

export default Spinner;
