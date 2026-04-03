import "../styles/footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">
          &copy; {year} Sigge &mdash; Built with React &amp; TypeScript
        </p>
        <nav className="footer-links" aria-label="Footer links">
          <a
            href="https://github.com/Sigge1511/PortfolioSigge"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
