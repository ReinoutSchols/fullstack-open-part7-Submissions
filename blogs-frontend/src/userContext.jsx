/* eslint-disable indent */
import { createContext, useReducer } from "react";

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("action.payload in userreducer:", action.payload);
      return action.payload;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [User, UserDispatch] = useReducer(userReducer, []);
  return (
    <UserContext.Provider value={[User, UserDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
