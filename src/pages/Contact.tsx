import React, { useState, type ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/pages/contact.css';

interface FormFields {
    name: string;
    email: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormFields): FormErrors {
    const errors: FormErrors = {};
    if (!fields.name.trim()) errors.name = 'Name is required.';
    if (!fields.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(fields.email)) {
        errors.email = 'Please enter a valid email address.';
    }
    if (!fields.message.trim()) errors.message = 'Message is required.';
    return errors;
}

function Contact() {
    const [fields, setFields] = useState<FormFields>({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<SubmitStatus>('idle');

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const validationErrors = validate(fields);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus('sending');
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                { name: fields.name, email: fields.email, message: fields.message },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            );
            setStatus('success');
            setFields({ name: '', email: '', message: '' });
        } catch (err) {
            // Log the error for debugging; show a friendly error state to the user.
            // If you want the real email sending behavior, run `npm install` to
            // restore the dependency and restart the dev server.
            // eslint-disable-next-line no-console
            console.error('Failed to send email', err);
            setStatus('error');
        }
    }

    return (
        <div className="contact">
           
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
                    <a href="mailto:msigfeldt@gmail.com" className="contact__link-item">
                        <div className="contact__link-left">
                            <span className="contact__link-platform">Email</span>
                            <span className="contact__link-name">msigfeldt@gmail.com</span>
                        </div>
                        <span className="contact__link-arrow" aria-hidden="true">&#8594;</span>
                    </a>
                    <a href="https://www.linkedin.com/in/maja-sigfeldt/" target="_blank" rel="noopener noreferrer" className="contact__link-item">
                        <div className="contact__link-left">
                            <span className="contact__link-platform">LinkedIn</span>
                            <span className="contact__link-name">linkedin.com/in/maja-sigfeldt</span>
                        </div>
                        <span className="contact__link-arrow" aria-hidden="true">&#8594;</span>
                    </a>
                </section>
                <section className="contact__form-section">
                    <p className="contact__form-title">Send a message</p>
                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                        <div className="contact-form__group">
                            <label htmlFor="contact-name" className="contact-form__label">Name</label>
                            <input
                                id="contact-name"
                                name="name"
                                type="text"
                                className="contact-form__input"
                                placeholder="Your name"
                                autoComplete="name"
                                value={fields.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="contact-form__error">{errors.name}</span>}
                        </div>
                        <div className="contact-form__group">
                            <label htmlFor="contact-email" className="contact-form__label">Email</label>
                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                className="contact-form__input"
                                placeholder="your@email.com"
                                autoComplete="email"
                                value={fields.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="contact-form__error">{errors.email}</span>}
                        </div>
                        <div className="contact-form__group">
                            <label htmlFor="contact-message" className="contact-form__label">Message</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                className="contact-form__textarea"
                                placeholder="What is on your mind?"
                                rows={5}
                                value={fields.message}
                                onChange={handleChange}
                            />
                            {errors.message && <span className="contact-form__error">{errors.message}</span>}
                        </div>
                        <button type="submit" className="contact-form__submit" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending\u2026' : 'Send Message'}
                        </button>
                    </form>
                    {status === 'success' && (
                        <p className="contact-form__status contact-form__status--success">
                            Message sent! I will get back to you soon.
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="contact-form__status contact-form__status--error">
                            Something went wrong. Please try again or email me directly.
                        </p>
                    )}
                </section>

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