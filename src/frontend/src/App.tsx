import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import MemoriesGalleryPage from './pages/MemoriesGalleryPage';
import LoveMessagesPage from './pages/LoveMessagesPage';
import TimelinePage from './pages/TimelinePage';
import InteractiveSurprisePage from './pages/InteractiveSurprisePage';
import FinalDedicationPage from './pages/FinalDedicationPage';
import EditContentPage from './pages/EditContentPage';

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const memoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memories',
  component: MemoriesGalleryPage
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: LoveMessagesPage
});

const timelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timeline',
  component: TimelinePage
});

const surpriseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/surprise',
  component: InteractiveSurprisePage
});

const dedicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dedication',
  component: FinalDedicationPage
});

const editRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit',
  component: EditContentPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  memoriesRoute,
  messagesRoute,
  timelineRoute,
  surpriseRoute,
  dedicationRoute,
  editRoute
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
