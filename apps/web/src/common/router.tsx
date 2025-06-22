import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthPage } from "../pages/auth";
import { BoardPage } from "../pages/board";
import { GeneralProvider } from "./general";
import { Layout } from "../components/Layout";
import { Domains } from "../pages/domains";
import { Windows } from "../pages/windows";
import TabList from "../components/TabList";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <GeneralProvider>
        <Layout>
          <Outlet />
        </Layout>
        <TanStackRouterDevtools />
      </GeneralProvider>
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TabList,
});

const domainsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domains",
  component: Domains,
});

const windowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/windows",
  component: Windows,
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  boardRoute,
  domainsRoute,
  windowsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const Router = () => {
  return <RouterProvider router={router} />;
};
