import { NavLink } from 'react-router-dom';
import cdcLogo from '../../assets/cdc-logo.png';

/**
 * items: [{ to: '/dashboard', label: 'Dashboard', icon: FiHome }]
 */
const Sidebar = ({ items, brandLabel }) => (
  <aside className="w-60 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
    <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200">
      <img src={cdcLogo} alt="CDC logo" className="h-9 w-9 rounded-lg" />
      <span className="text-brand-700 font-semibold text-base">{brandLabel}</span>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
             ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
          }
        >
          {Icon && <Icon className="shrink-0" size={17} />}
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
