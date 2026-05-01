declare global {
  interface ImportMetaEnv {
    VITE_EMAILJS_SERVICE_ID?: string;
    VITE_EMAILJS_TEMPLATE_ID?: string;
    VITE_EMAILJS_PUBLIC_KEY?: string;
    // add other VITE_ env vars you use here
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
