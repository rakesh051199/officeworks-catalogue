export type AppConfig = {
  port: number;
  corsOrigin: string;
  fakeStoreBaseUrl: string;
  featuredCount: number;
  categoryTopRatedCount: number;
  salesInbox: string;
  mailFrom: string;
  smtpHost: string;
  smtpPort: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: Number(env.PORT ?? 3001),
    corsOrigin: env.CORS_ORIGIN ?? "http://localhost:5173",
    fakeStoreBaseUrl: env.FAKE_STORE_BASE_URL ?? "https://fakestoreapi.com",
    featuredCount: Number(env.FEATURED_COUNT ?? 5),
    categoryTopRatedCount: Number(env.CATEGORY_TOP_RATED_COUNT ?? 3),
    salesInbox: env.SALES_INBOX ?? "sales@example.com",
    mailFrom: env.MAIL_FROM ?? "catalogue@example.com",
    smtpHost: env.SMTP_HOST ?? "localhost",
    smtpPort: Number(env.SMTP_PORT ?? 1025)
  };
}
