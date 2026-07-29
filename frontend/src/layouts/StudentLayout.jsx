import { Outlet, useLocation } from 'react-router-dom';
import { FiHome, FiUser, FiBriefcase, FiFileText } from 'react-icons/fi';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/jobs', label: 'Job Openings', icon: FiBriefcase },
  { to: '/applications', label: 'My Applications', icon: FiFileText },
  { to: '/profile', label: 'My Profile', icon: FiUser },
];

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/jobs': 'Job Openings',
  '/applications': 'My Applications',
  '/profile': 'My Profile',
};

const StudentLayout = () => {
  const { pathname } = useLocation();
  const title = Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] || 'CDC Portal';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={NAV_ITEMS} brandLabel="CDC Portal" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
