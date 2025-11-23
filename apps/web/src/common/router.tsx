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
import { FilteredResults } from "../pages/filtered";
import { HomePage } from "../pages/home";

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

// Root route - Hello World
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// App route - parent for all existing routes
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: () => <Outlet />,
});

// All existing routes moved under /app
const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: ChronologicalTabs,
});

const domainsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/domains",
  component: Domains,
});

const windowsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/windows",
  component: Windows,
});

const authRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/auth",
  component: AuthPage,
});

const boardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/board",
  component: BoardPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/about",
  component: AboutPage,
});

const filteredRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/filtered",
  component: FilteredResults,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  appRoute.addChildren([
    appIndexRoute,
    authRoute,
    boardRoute,
    domainsRoute,
    windowsRoute,
    privacyRoute,
    aboutRoute,
    filteredRoute,
  ]),
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
