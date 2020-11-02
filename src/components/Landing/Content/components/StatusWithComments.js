import React from "react";

const StatusWithComments = ({ status, numUnreadMessages }) => {
  let statusText;

  switch (status) {
    case "submitted":
      statusText = "Submitted";
      break;
    case "inProgress":
      statusText = "In-Progress";
      break;
    case "approved":
      statusText = "Approved";
      break;
    case "readyToPresent":
      statusText = "Ready to Present";
      break;
    default:
      statusText = "";
  }
  return (
    <div
      style={{
        minWidth: 160,
        display: "flex",
        alignItems: "center",
      }}
    >
      {statusText}
      {numUnreadMessages !== 0 && (
        <div
          style={{
            color: "#fff",
            backgroundColor: "#FF4D4F",
            width: 15,
            height: 15,
            borderRadius: "50%",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <span>{numUnreadMessages}</span>
        </div>
      )}
    </div>
  );
};

export default StatusWithComments;
