import helmet from "helmet";

/**
 * Applies HTTP security headers via Helmet.
 * CSP and COEP disabled for a JSON API; no rate limiting.
 */
export function securityMiddleware() {
  return helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });
}
