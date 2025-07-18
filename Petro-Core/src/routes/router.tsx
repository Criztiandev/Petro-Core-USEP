import PageLayout from '@/layouts/page.layout';
import HeroSection from '@/modules/home/hero/hero';
import AdminLayout from '@/layouts/admin.layout';
import DashboardPage from '@/modules/admin/dashboard/dashboard.page';
import LoginPage from '@/modules/auth/login.page';
import RegisterPage from '@/modules/auth/register.page';
import ForgotPasswordPage from '@/modules/auth/forgotPassword.page';
import ProtectedRoute from '@/components/protected-route';
import RockMinerals from '@/modules/home/rocks-minerals/rocks-minerals-page';
import RockDetailView from '@/modules/home/rocks-minerals/rock-detail-view';
import MineralDetailView from '@/modules/home/rocks-minerals/mineral-detail-view';
import RocksMineralsMap from '@/modules/home/map/maps-page';
import { AdminGuard } from '@/components/role-guard';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GeologyPage } from '@/modules/admin/geology';
import UserPage from '@/modules/admin/users/users.page';
import UsersList from '@/modules/admin/users/user-list';
import FieldWorks from '@/modules/home/fieldworks/fieldworks.page';
import FieldDetailView from '@/modules/home/fieldworks/field-detail-view';
import LockdownPage from '@/modules/admin/lockdown/lockdown-page';
import { LockdownGuard } from '@/components/lockdown-guard';
import { SupabaseTester } from '@/supabase-tester';
import FieldWorkFilePage from '@/modules/admin/files/file-page';
import { TriviaPage } from '@/modules/admin/trivia';
import AboutUsPage from '@/modules/home/about-us/about-us-page';
import TestFieldworksBucket from '../test-fieldworks-bucket';
import ErrorPage from '@/components/error-page';

// Higher order component to wrap routes with role guards
// This function is currently unused and can be removed or exported if needed elsewhere.
// If you intend to use it, consider exporting it or using it in your route definitions.
// Removed unused 'withRoleGuard' to fix lint error.
// (Function removed. No code needed.)

// Higher order component to wrap routes with lockdown guard
const withLockdownGuard = (Component: React.ComponentType) => {
  return () => (
    <LockdownGuard>
      <Component />
    </LockdownGuard>
  );
};

const router = createBrowserRouter([
  // Root path redirects to login
  {
    path: '/',
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorPage />,
  },
  // Auth routes
  {
    path: '/login',
    Component: LoginPage,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    Component: RegisterPage,
    errorElement: <ErrorPage />,
  },
  {
    path: '/forgot-password',
    Component: ForgotPasswordPage,
    errorElement: <ErrorPage />,
  },
  // Supabase testing route
  {
    path: '/supabase-test',
    element: <SupabaseTester />,
    errorElement: <ErrorPage />,
  },
  // Main application routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <PageLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'home',
        Component: HeroSection,
      },
      {
        path: 'about-us',
        Component: AboutUsPage,
      },
      {
        path: 'rock-minerals',
        Component: withLockdownGuard(RockMinerals),
      },
      {
        path: 'rock-minerals/rock/:id',
        Component: withLockdownGuard(RockDetailView),
      },
      {
        path: 'rock-minerals/mineral/:id',
        Component: withLockdownGuard(MineralDetailView),
      },
      {
        path: 'rock-minerals/map',
        Component: withLockdownGuard(RocksMineralsMap),
      },
      {
        path: 'field-works',
        Component: withLockdownGuard(FieldWorks),
      },
      {
        path: 'field-works/:fieldId',
        Component: withLockdownGuard(FieldDetailView),
      },
    ],
  },
  // Admin dashboard routes - only accessible by admins
  {
    path: '/dashboard-app',
    element: (
      <ProtectedRoute>
        <AdminGuard>
          <AdminLayout />
        </AdminGuard>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        children: [
          {
            index: true,
            Component: DashboardPage,
          },

          {
            path: 'users',
            Component: UserPage,
            children: [
              {
                index: true,
                Component: UsersList,
              },
              {
                path: 'users-list',
                Component: UsersList,
              },
            ],
          },
          {
            path: 'geology',
            Component: GeologyPage,
          },
          {
            path: 'lockdown',
            Component: LockdownPage,
          },
          {
            path: 'trivia',
            Component: TriviaPage,
          },
          {
            path: 'field-work-files',
            Component: FieldWorkFilePage,
          },
        ],
      },
    ],
  },
  // Add the test route
  {
    path: '/test-fieldworks',
    element: <TestFieldworksBucket />,
    errorElement: <ErrorPage />,
  },
  // Catch-all for unknown routes
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
