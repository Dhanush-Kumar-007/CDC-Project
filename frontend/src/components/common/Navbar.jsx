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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <img src={cdcLogo} alt="CDC logo" className="h-9 w-9 rounded-lg" />
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiUser className="text-gray-400" />
          <span>{user?.fullName || user?.name}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <FiLogOut />
          Log out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
