import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import { NotificationContextProvider } from "./notificationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const store = configureStore({
  reducer: {
    blog: blogReducer,
    user: userReducer,
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationContextProvider>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </NotificationContextProvider>,
);
