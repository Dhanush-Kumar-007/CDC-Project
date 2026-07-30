import { NavLink } from 'react-router-dom';
import cdcLogo from '../../assets/cdc-logo.png';

/**
 * items: [{ to: '/dashboard', label: 'Dashboard', icon: FiHome }]
 */
const Sidebar = ({ items, brandLabel }) => (
  <aside className="w-60 shrink-0 bg-brand-700 border-r border-brand-600 h-screen sticky top-0 flex flex-col text-white">
    <div className="h-16 flex items-center gap-3 px-4 border-b border-brand-600">
      <img src={cdcLogo} alt="CDC logo" className="h-9 w-9 rounded-lg border border-white/20" />
      <span className="text-white font-semibold text-base">{brandLabel}</span>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
             ${isActive ? 'bg-brand-600 text-white' : 'text-white/90 hover:bg-brand-600/80 hover:text-white'}`
          }
        >
          {Icon && <Icon className="shrink-0 text-white/90" size={17} />}
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
