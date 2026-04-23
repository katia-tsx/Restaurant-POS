
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import KitchenPage from './pages/KitchenPage';
import BarPage from './pages/BarPage';
import MenuPage from './pages/MenuPage';
import TablesPage from './pages/TablesPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SearchPage from './pages/SearchPage';
import { useAuthStore } from './stores/authStore';
import { canAccessRoute, getHomePathForRole, type RouteKey } from './config/permissions';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RequireRoute({ routeKey, children }: { routeKey: RouteKey; children: JSX.Element }) {
  const role = useAuthStore((s) => s.role);
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  if (!canAccessRoute(role, routeKey)) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<RequireRoute routeKey="dashboard"><DashboardPage /></RequireRoute>} />
        <Route path="search" element={<RequireRoute routeKey="dashboard"><SearchPage /></RequireRoute>} />
        <Route path="orders" element={<RequireRoute routeKey="orders"><OrdersPage /></RequireRoute>} />
        <Route path="kitchen" element={<RequireRoute routeKey="kitchen"><KitchenPage /></RequireRoute>} />
        <Route path="bar" element={<RequireRoute routeKey="bar"><BarPage /></RequireRoute>} />
        <Route path="menu" element={<RequireRoute routeKey="menu"><MenuPage /></RequireRoute>} />
        <Route path="tables" element={<RequireRoute routeKey="tables"><TablesPage /></RequireRoute>} />
        <Route path="payments" element={<RequireRoute routeKey="payments"><PaymentsPage /></RequireRoute>} />
        <Route path="reports" element={<RequireRoute routeKey="reports"><ReportsPage /></RequireRoute>} />
        <Route path="users" element={<RequireRoute routeKey="users"><UsersPage /></RequireRoute>} />
      </Route>
      <Route path="*" element={<CatchAll />} />
    </Routes>
  );
}

function CatchAll() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to={getHomePathForRole(role)} replace />;
}
