import '../styles/pages/contact.css';

function Contact() {
  return (
    <div className="contact">
      <div className="contact__banner" style={{ backgroundImage: 'linear-gradient(135deg, rgba(5, 51, 17, 0.6) 0%, rgba(8, 64, 23, 0.6) 100%), url("../assets/hero.png")' }}>
        <h1 className="contact__banner-title">Get in touch</h1>
      </div>

      <div className="contact__wrapper">
        <div className="contact__links">
          <a href="https://github.com/sigge1511" target="_blank" rel="noopener noreferrer" className="contact__link">
            <span className="contact__link-text">GitHub</span>
            <span className="contact__link-icon">→</span>
          </a>
          <a href="mailto:your.email@example.com" className="contact__link">
            <span className="contact__link-text">Email</span>
            <span className="contact__link-icon">→</span>
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="contact__link">
            <span className="contact__link-text">LinkedIn</span>
            <span className="contact__link-icon">→</span>
          </a>
        </div>

        <form className="contact__form" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="contact__form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Your name" autoComplete="name" />
          </div>
          <div className="contact__form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="your@email.com" autoComplete="email" />
          </div>
          <div className="contact__form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="What's on your mind?" rows={6} />
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;