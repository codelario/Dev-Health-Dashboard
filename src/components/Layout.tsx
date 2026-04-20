import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-calmBlue text-white" : "text-slate-700 hover:bg-slate-100"}`;

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">Dev-Health Dashboard</span>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>

            {isAuthenticated && (
              <>
                <span className="hidden text-sm text-slate-600 md:inline">{user?.name}</span>
                <button className="rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
