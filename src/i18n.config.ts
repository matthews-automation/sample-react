export const defaultLocale = 'en';
export const locales: string[] = ['en', 'es', 'de'];

export const localePrefix = 'as-needed';

export const port = process.env.PORT || 3000;
export const host = process.env.NEXT_PUBLIC_FE_URL || `http://localhost:${port}`;