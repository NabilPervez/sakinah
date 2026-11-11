import { Link, useLocation } from 'react-router-dom';

interface TopBarProps {
  title: string;
  icon: string;
  right?: React.ReactNode;
}

/** Shared top bar. SOS is always one tap away (Nabil, 2026-11-03). */
export default function TopBar({ title, icon, right }: TopBarProps) {
  const { pathname } = useLocation();
  return (
    <header className="top-bar">
      <div className="top-bar-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '22px' }}>
          {icon}
        </span>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {right}
        {pathname !== '/reminders' && (
          <Link to="/reminders" className="topbar-bell" aria-label="Reminders and notifications">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }} aria-hidden="true">notifications</span>
          </Link>
        )}
        {pathname !== '/settings' && (
          <Link to="/settings" className="topbar-bell" aria-label="Settings">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }} aria-hidden="true">settings</span>
          </Link>
        )}
        {pathname !== '/sos' && (
          <Link to="/sos" className="sos-link" aria-label="SOS: emergency reset">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">emergency</span>SOS
          </Link>
        )}
      </div>
    </header>
  );
}
