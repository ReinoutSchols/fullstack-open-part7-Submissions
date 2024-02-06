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
      <div className="alert alert-primary" role="alert">
        {message}
      </div>
    </div>
  );
};

export default Notification;
