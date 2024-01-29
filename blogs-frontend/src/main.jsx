import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import { NotificationContextProvider } from "./notificationContext";

const store = configureStore({
  reducer: {
    blog: blogReducer,
    user: userReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </NotificationContextProvider>,
);
