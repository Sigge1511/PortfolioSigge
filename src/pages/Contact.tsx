import { useState } from "react";
import "../styles/contact.css";
import "../styles/about.css";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <div className="page-banner">
        <div className="page-banner-inner">
          <p className="page-banner-label">Get in touch</p>
          <h1 className="page-banner-title">Contact Me</h1>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-grid">
          <div>
            <h2 style={{ marginBottom: "24px", fontSize: "1.5rem" }}>Send a message</h2>

            {submitted ? (
              <div className="form-success" role="alert">
                Message sent! I&apos;ll get back to you soon.
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    aria-required="true"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    aria-required="true"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    required
                    aria-required="true"
                    placeholder="What is on your mind?"
                    rows={6}
                  />
                </div>

                <button type="submit" className="form-submit">
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="contact-info">
            <h2>Let&apos;s connect</h2>
            <p>
              I&apos;m open to project collaborations, internship opportunities, or just
              a conversation about code. Feel free to reach out.
            </p>

            <nav className="social-links" aria-label="Social links">
              <a
                href="https://github.com/Sigge1511"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-link-icon" aria-hidden="true">GH</span>
                GitHub &mdash; Sigge1511
              </a>
              <a
                href="https://linkedin.com/in/sigge"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-link-icon" aria-hidden="true">in</span>
                LinkedIn
              </a>
              <a
                href="mailto:sigge@example.com"
                className="social-link"
              >
                <span className="social-link-icon" aria-hidden="true">@</span>
                sigge@example.com
              </a>
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
