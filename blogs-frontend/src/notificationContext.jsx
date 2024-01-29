/* eslint-disable indent */
import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "MESSAGE":
      console.log("MESSAGE in notireducer:", action.payload);
      return action.payload;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [Message, MessageDispatch] = useReducer(notificationReducer, null);
  return (
    <NotificationContext.Provider value={[Message, MessageDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
