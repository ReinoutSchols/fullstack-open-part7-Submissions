// Notification.js
import React from "react";
import { useContext } from "react";
import NotificationContext from "../notificationContext";

const Notification = () => {
  const [message, dispatch] = useContext(NotificationContext);
  console.log("Notification Component - Received message:", message);
  if (message === null) {
    return null;
  }

  return (
    <div className={message.includes("Error") ? "error" : "success"}>
      {message}
    </div>
  );
};

export default Notification;
