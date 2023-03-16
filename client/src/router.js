import { createBrowserRouter } from "react-router-dom";
import App from "./App.js";
import Chats from "./pages/Chats.js";
import Home from "./pages/Home.js";
import Room from "./pages/Room.js";
import Sign from "./pages/signUp.js";
import Choice from "./pages/Choice.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chats",
        element: <Chats />,
      },
      {
        path: "/room/:roomId",
        element: <Room />,
      },
      {
        path: "/signUp",
        element: < Sign/>,
      },
      {
        path: "/choose",
        element: < Choice/>,
      },
    ],
  },
]);

export default router;