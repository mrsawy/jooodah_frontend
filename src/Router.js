import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/App";
import { Navigate } from "react-router-dom";
import Spinner from "./components/Spinner";
// import { Page404 } from "./Dashboard/src/routes/sections";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <App />,
  // },
  {
    path: "/quiz",
    element: <App />,
  },
  {
    path: "/convince-test",
    element: <App />,
  },
  {
    path: "/accounting-test",
    element: <App />,
  },
  {
    path: "/convince-quiz",
    element: <App />,
  },
]);

export default router;
