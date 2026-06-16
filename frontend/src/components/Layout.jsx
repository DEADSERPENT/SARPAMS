import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PawPrint, Grid3X3, Building2,
  ShieldCheck, Siren, Stethoscope, FileHeart,
  Home, ArrowLeftRight, Users, HeartHandshake, LogOut
} from 'lucide-react';

const navItems = [
  { to: '/',                    label: 'Dashboard',           icon: LayoutDashboard, section: 'Overview' },
  { to: '/animals',             label: 'Animals',             icon: PawPrint,         section: 'Registry' },
  { to: '/cages',               label: 'Cages',               icon: Grid3X3,          section: null },
  { to: '/shelters',            label: 'Shelters',            icon: Building2,        section: null },
  { to: '/rescuers',            label: 'Rescuers',            icon: ShieldCheck,      section: 'Operations' },
  { to: '/rescue-requests',     label: 'Rescue Requests',     icon: Siren,            section: null },
  { to: '/veterinarians',       label: 'Veterinarians',       icon: Stethoscope,      section: 'Medical' },
  { to: '/medical-records',     label: 'Medical Records',     icon: FileHeart,        section: null },
  { to: '/foster-families',     label: 'Foster Families',     icon: Home,             section: 'Foster & Adopt' },
  { to: '/foster-placements',   label: 'Foster Placements',   icon: ArrowLeftRight,   section: null },
  { to: '/adoption-applicants', label: 'Adoption Applicants', icon: Users,            section: null },
  { to: '/adoptions',           label: 'Adoptions',           icon: HeartHandshake,   section: null },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const pageTitles = {
    '/': 'Dashboard',
    '/animals': 'Animals',
    '/cages': 'Cages',
    '/shelters': 'Shelters',
    '/rescuers': 'Rescuers',
    '/rescue-requests': 'Rescue Requests',
    '/veterinarians': 'Veterinarians',
    '/medical-records': 'Medical Records',
    '/foster-families': 'Foster Families',
    '/foster-placements': 'Foster Placements',
    '/adoption-applicants': 'Adoption Applicants',
    '/adoptions': 'Adoptions',
  };

  const currentTitle = pageTitles[location.pathname] || 'SARPAMS';

  let lastSection = null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-title">SARPAMS</div>
          <div className="logo-sub">Stray Animals Rescue &amp; Pet Adoption</div>
        </div>
        <ul className="sidebar-nav">
          {navItems.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const Icon = item.icon;
            return (
              <React.Fragment key={item.to}>
                {showSection && <li className="nav-section-title">{item.section}</li>}
                <li>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <Icon className="nav-icon" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{currentTitle}</span>
          <div className="topbar-right">
            <span className="topbar-badge">SARPAMS v2.0</span>
            <button className="logout-btn" onClick={handleLogout} title="Sign out">
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
