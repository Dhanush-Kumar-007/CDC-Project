import { Outlet, useLocation } from 'react-router-dom';
import { FiGrid, FiBriefcase } from 'react-icons/fi';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/jobs', label: 'Manage Jobs', icon: FiBriefcase },
];

const PAGE_TITLES = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/jobs': 'Manage Jobs',
};

const AdminLayout = () => {
  const { pathname } = useLocation();
  const title =
    Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] || 'CDC Admin';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={NAV_ITEMS} brandLabel="CDC Admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
