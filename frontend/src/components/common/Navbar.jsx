import { FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import cdcLogo from '../../assets/cdc-logo.png';

const Navbar = ({ title }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(role === 'admin' ? '/admin/login' : '/login');
  };
  return (
    <header className="h-16 bg-brand-700 border-b border-brand-600 flex items-center justify-between px-6 sticky top-0 z-10 text-white">
      <div className="flex items-center gap-3">
        <img src={cdcLogo} alt="CDC logo" className="h-9 w-9 rounded-lg border border-white/20" />
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-white/90">
          <FiUser className="text-white/80" />
          <span className="truncate max-w-[180px]">{user?.fullName || user?.name}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white"
        >
          <FiLogOut />
          Log out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
