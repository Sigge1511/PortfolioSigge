import { Link } from 'react-router-dom';
import '../styles/hero.css';

interface HeroBannerProps {
  label?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; to: string; };
  secondaryCta?: { label: string; to: string; };
}

function HeroBanner({ label, title, subtitle, primaryCta, secondaryCta }: HeroBannerProps) {
  return (
    <section className="hero-banner" aria-label="Hero">
      <div className="hero-banner__bg" aria-hidden="true" />
      <div className="hero-banner__fade" aria-hidden="true" />
      <div className="hero-banner__content">
        {label && <span className="hero-banner__label">{label}</span>}
        <h1 className="hero-banner__title">{title}</h1>
        {subtitle && <p className="hero-banner__subtitle">{subtitle}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="hero-banner__actions">
            {primaryCta && (
              <Link to={primaryCta.to} className="btn btn--primary">
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link to={secondaryCta.to} className="btn btn--outline">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroBanner;