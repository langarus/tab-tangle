import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import App from "../App";
import { AuthPage } from "../pages/auth";
import { BoardPage } from "../pages/board";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board",
  component: BoardPage,
});

const routeTree = rootRoute.addChildren([indexRoute, authRoute, boardRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const Router = () => {
  return <RouterProvider router={router} />;
};
