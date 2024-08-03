import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import EnterGameCode from "@/views/EnterGameCode";

import "react-toastify/dist/ReactToastify.css";
import "./global.scss";
import Game from "./views/Game";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import JoinGame from "./views/JoinGame";

document.body.setAttribute("data-theme", "light");
document.body.setAttribute("data-theme", "dark");

const router = createBrowserRouter([
  {
    path: "/",
    element: <EnterGameCode />,
  },

  {
    path: "game/:gameId",
    element: <Game />,
  },
  {
    path: "game/:gameId/join",
    element: <JoinGame />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </React.StrictMode>,
);
