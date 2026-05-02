import { useState, useRef, useEffect, type ChangeEvent, type SyntheticEvent } from 'react';
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

interface GeneralError {
    message?: string;
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate environment variables on load
const validateEnvVars = () => {
    const required = [
        'VITE_EMAILJS_SERVICE_ID',
        'VITE_EMAILJS_TEMPLATE_ID',
        'VITE_EMAILJS_PUBLIC_KEY'
    ];

    const missing = required.filter(key => {
        const value = import.meta.env[key];
        return !value || value.trim() === '';
    });

    if (missing.length > 0) {
        console.error('Missing or empty environment variables:', missing);
        console.log('Current env vars:', {
            'VITE_EMAILJS_SERVICE_ID': import.meta.env.VITE_EMAILJS_SERVICE_ID,
            'VITE_EMAILJS_TEMPLATE_ID': import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            'VITE_EMAILJS_PUBLIC_KEY': import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '***' : 'missing'
        });
        return false;
    }

    // Initialize EmailJS with public key
    try {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY!);
        console.log('EmailJS initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        return false;
    }
};

const ENV_VARS_VALID = validateEnvVars();

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
    const [generalError, setGeneralError] = useState<string>('');
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        // Clear general error when user starts typing
        if (generalError) {
            setGeneralError('');
        }
    }

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        // Prevent double submission
        if (isSubmitting) {
            return;
        }

        const validationErrors = validate(fields);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Check environment variables
        if (!ENV_VARS_VALID) {
            setStatus('error');
            setGeneralError('Email service is not configured. Please contact me directly at msigfeldt@gmail.com');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setStatus('sending');

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID!,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
                {
                    name: fields.name,
                    email: fields.email,
                    message: fields.message,
                    to_name: 'Maja Sigfeldt',
                    from_name: fields.name,
                    reply_to: fields.email
                }
            );

            setStatus('success');
            setFields({ name: '', email: '', message: '' });
            setErrors({});
            setGeneralError('');

            // Reset form
            if (formRef.current) {
                formRef.current.reset();
            }

            // Clear success message after 5 seconds
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
            submitTimeoutRef.current = setTimeout(() => {
                setStatus('idle');
            }, 5000);

        } catch (err) {
            console.error('Failed to send email:', err);
            setStatus('error');

            // Provide more specific error message
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setGeneralError(`Failed to send message: ${errorMessage}. Please try again or email me directly at msigfeldt@gmail.com`);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

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
                    <form
                        ref={formRef}
                        className="contact-form"
                        onSubmit={handleSubmit}
                        noValidate
                        aria-label="Contact form"
                    >
                        <div className="contact-form__group">
                            <label htmlFor="contact-name" className="contact-form__label">Name</label>
                            <input
                                id="contact-name"
                                name="name"
                                type="text"
                                className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
                                placeholder="Your name"
                                autoComplete="name"
                                value={fields.name}
                                onChange={handleChange}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                            />
                            {errors.name && (
                                <span id="contact-name-error" className="contact-form__error" role="alert">
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="contact-form__group">
                            <label htmlFor="contact-email" className="contact-form__label">Email</label>
                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
                                placeholder="your@email.com"
                                autoComplete="email"
                                value={fields.email}
                                onChange={handleChange}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                            />
                            {errors.email && (
                                <span id="contact-email-error" className="contact-form__error" role="alert">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="contact-form__group">
                            <label htmlFor="contact-message" className="contact-form__label">Message</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                className={`contact-form__textarea ${errors.message ? 'contact-form__textarea--error' : ''}`}
                                placeholder="What is on your mind?"
                                rows={5}
                                value={fields.message}
                                onChange={handleChange}
                                aria-invalid={!!errors.message}
                                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                            />
                            {errors.message && (
                                <span id="contact-message-error" className="contact-form__error" role="alert">
                                    {errors.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="contact-form__submit"
                            disabled={status === 'sending' || isSubmitting}
                            aria-busy={status === 'sending' || isSubmitting}
                        >
                            {status === 'sending' || isSubmitting ? 'Sending\u2026' : 'Send Message'}
                        </button>
                    </form>

                    {status === 'success' && (
                        <p className="contact-form__status contact-form__status--success" role="status" aria-live="polite">
                            Message sent! I will get back to you soon.
                        </p>
                    )}

                    {status === 'error' && (
                        <p className="contact-form__status contact-form__status--error" role="alert" aria-live="assertive">
                            {generalError || 'Something went wrong. Please try again or email me directly at msigfeldt@gmail.com'}
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Contact;