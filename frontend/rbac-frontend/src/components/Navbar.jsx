import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      <div className="flex-none lg:hidden">
        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <h1 className="text-xl font-bold">🔐 RBAC Configurator</h1>
      </div>
      <div className="flex-none">
        {user && (
          <div className="dropdown dropdown-end">
            <div className="avatar placeholder mr-2">
              <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs">{user.email?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
            </div>
            <button className="btn btn-error btn-sm" onClick={() => {
              try {
                logout();
              } catch (error) {
                console.error('Logout failed:', error);
              }
            }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;