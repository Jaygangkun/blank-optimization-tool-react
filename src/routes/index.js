import { lazy } from "react";
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

var indexRoutes = [
  { path: "/", name: "Dashboard", component: FullLayout },
];

export default indexRoutes;
