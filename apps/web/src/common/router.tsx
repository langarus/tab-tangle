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
import ChronologicalTabs from "../components/ChronologicalTabs";
import { PrivacyPage } from "../pages/privacy";
import { AboutPage } from "../pages/about";

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
  component: ChronologicalTabs,
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

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  boardRoute,
  domainsRoute,
  windowsRoute,
  privacyRoute,
  aboutRoute,
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
