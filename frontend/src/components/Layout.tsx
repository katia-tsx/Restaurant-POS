
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const hydrateRole = useAuthStore((s) => s.hydrateRole);
  useEffect(() => {
    hydrateRole();
  }, [hydrateRole]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="content-scroll">
          <Header />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
