import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: 'https://83a2de9c220a0722c9c2aa506dd4d8cd@o4509664610353152.ingest.us.sentry.io/4509664628703232',
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
