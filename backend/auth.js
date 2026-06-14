const { createRemoteJWKSet, jwtVerify } = require('jose');

// Supabase project URL, e.g. https://lscoyqlbkhqqtsrzlhwc.supabase.co
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  (process.env.SUPABASE_PROJECT_REF
    ? `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co`
    : '');

if (!SUPABASE_URL) {
  console.error('ERROR: set SUPABASE_URL or SUPABASE_PROJECT_REF');
  process.exit(1);
}

const ISSUER = `${SUPABASE_URL}/auth/v1`;

// Cached remote JWKS — verification is offline after the first fetch.
// Works with Supabase asymmetric JWT signing keys (no shared secret needed).
const JWKS = createRemoteJWKSet(
  new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

// Verify a Supabase access token and return its claims (payload.sub = user id).
// Throws if the token is missing, expired, or has an invalid signature.
async function verifySupabaseJWT(token) {
  const { payload } = await jwtVerify(token, JWKS, { issuer: ISSUER });
  return payload;
}

module.exports = { verifySupabaseJWT };
