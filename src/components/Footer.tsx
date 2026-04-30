import { Link } from 'react-router-dom';
import '../styles/footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__right">
          <nav className="footer__links" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/skills">Skills</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <p className="footer__copy">&#169; {year} Sigge &#8212; Built with React + TypeScript</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;