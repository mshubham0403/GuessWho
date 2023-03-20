import { createBrowserRouter } from "react-router-dom";
import App       from "./App.js";
import Chats     from "./pages/Chats.js";
import Home      from "./pages/Home.js";
import Room      from "./pages/Room.js";
import Sign      from "./pages/SignUp.js";
import Choice    from "./pages/Choice.js";
import NewRoom   from "./pages/RoomDemo.js";
import Profile   from "./pages/Profile.js";


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
        {
          path: "/newRoom",
          element: < NewRoom/>,
        },
        {
          path: "/profile",
          element: < Profile/>,
        },
      
      
      ],
    },
  ]);

 export default router;

