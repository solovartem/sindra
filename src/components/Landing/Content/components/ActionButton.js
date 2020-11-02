import React from "react";
import { Button } from "antd";

const ActionButton = ({ status, soaId }) => {
  let btnText;
  let onClick;

  switch (status) {
    case "submitted":
      btnText = "View DSRF";
      onClick = () => {
        console.log("View DSRF", soaId);
      };
      break;
    case "inProgress":
      btnText = "View draft SoA";
      onClick = () => {
        console.log("View draft SoA", soaId);
      };
      break;
    case "approved":
      btnText = "Preview SoA";
      onClick = () => {
        console.log("Preview SoA", soaId);
      };
      break;
    case "readyToPresent":
      btnText = "Present SoA";
      onClick = () => {
        console.log("Present SoA", soaId);
      };
      break;
    default:
      btnText = "";
      onClick = () => {};
  }

  return (
    <Button style={{ width: "128px" }} onClick={onClick}>
      {btnText}
    </Button>
  );
};

export default ActionButton;
