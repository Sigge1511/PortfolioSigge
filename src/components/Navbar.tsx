import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/navbar.css';

const navItems = [
  { label: 'Home',     to: '/' },
  { label: 'About',    to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Skills',   to: '/skills' },
  { label: 'Contact',  to: '/contact' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={'navbar' + (isOpen ? ' is-open' : '')} role="banner">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          Home
        </Link>
        <button
          className="navbar__toggle"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="navbar-menu" className="navbar__menu" aria-label="Main navigation">
          <ul className="navbar__links">
            {navItems.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} onClick={closeMenu}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;