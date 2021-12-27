import { lazy } from "react";

//Lazy loading and code splitting
const BOTParameters = lazy(() => import("../views/bot/BOTParameters"));
const BOT = lazy(() => import("../views/bot/BOT"));

var BOTRoutes = [
  // {
  //   path: "/",
  //   name: "Dashboard",
  //   icon: "mdi mdi-note",
  //   component: BOT,
  // }
];
export default BOTRoutes;
