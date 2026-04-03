import '../styles/pages/contact.css';

function Contact() {
  return (
    <div className="contact">
      <header className="contact__header">
        <div className="contact__header-inner">
          <p className="contact__page-label">Get in touch</p>
          <h1 className="contact__headline">Contact</h1>
        </div>
      </header>
      <div className="contact__content">
        <section className="contact__links-section">
          <p className="contact__links-title">Find me here</p>
          <a href="https://github.com/sigge1511" target="_blank" rel="noopener noreferrer" className="contact__link-item">
            <div className="contact__link-left">
              <span className="contact__link-platform">GitHub</span>
              <span className="contact__link-name">sigge1511</span>
            </div>
            <span className="contact__link-arrow" aria-hidden="true">&#8594;</span>
          </a>
          <a href="mailto:your.email@example.com" className="contact__link-item">
            <div className="contact__link-left">
              <span className="contact__link-platform">Email</span>
              <span className="contact__link-name">your.email@example.com</span>
            </div>
            <span className="contact__link-arrow" aria-hidden="true">&#8594;</span>
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="contact__link-item">
            <div className="contact__link-left">
              <span className="contact__link-platform">LinkedIn</span>
              <span className="contact__link-name">linkedin.com/in/yourprofile</span>
            </div>
            <span className="contact__link-arrow" aria-hidden="true">&#8594;</span>
          </a>
        </section>
        <section className="contact__form-section">
          <p className="contact__form-title">Send a message</p>
          <p className="contact__form-note">This form is a front-end demo. Connect EmailJS or Formspree to make it functional.</p>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="contact-form__group">
              <label htmlFor="contact-name" className="contact-form__label">Name</label>
              <input id="contact-name" type="text" className="contact-form__input" placeholder="Your name" autoComplete="name" />
            </div>
            <div className="contact-form__group">
              <label htmlFor="contact-email" className="contact-form__label">Email</label>
              <input id="contact-email" type="email" className="contact-form__input" placeholder="your@email.com" autoComplete="email" />
            </div>
            <div className="contact-form__group">
              <label htmlFor="contact-message" className="contact-form__label">Message</label>
              <textarea id="contact-message" className="contact-form__textarea" placeholder="What is on your mind?" rows={5} />
            </div>
            <button type="submit" className="contact-form__submit">Send Message</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Contact;