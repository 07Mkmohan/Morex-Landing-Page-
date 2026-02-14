import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import heroImage from '../assets/image.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isActive = (path: string) => (pathname === path ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar"> 
      <Link to="/" className="brand">
        <img src={heroImage} alt="Smart Paint Factory ERP System" className="brand-logo" width={42} height={42} />
        <div>
          <p className="brand-name">Morex Technology</p>
          <p className="brand-sub">Secure digital experiences</p>
        </div>
      </Link>

      <nav className="nav-links">
        <Link className={isActive('/')} to="/">
          Home
        </Link>
        <a className="nav-link" href="#features">
          Features
        </a>
         <Link className={isActive('/about')} to="/about">
          About
        </Link>
        <a className="nav-link" href="#pricing">
          Pricing
        </a>
       
        {user?.role === 'admin' && (
          <Link className={isActive('/admin')} to="/admin">
            Admin
          </Link>
        )}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="pill">
              {user.name} · {user.role}
            </span>
            <button className="btn ghost" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost">
              Login
            </Link>
            <Link to="/register" className="btn primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
