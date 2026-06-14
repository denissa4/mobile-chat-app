require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifySupabaseJWT } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

const DIRECT_LINE_SECRET = process.env.CHAT_APP_DIRECT_LINE_SECRET;
const DIRECT_LINE_TOKEN_URL =
  'https://directline.botframework.com/v3/directline/tokens/generate';

if (!DIRECT_LINE_SECRET) {
  console.error('ERROR: CHAT_APP_DIRECT_LINE_SECRET is not set');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Exchange secret → temporary Direct Line token.
// Requires a valid Supabase access token; the Direct Line user is derived
// from the verified JWT, never from client-supplied input.
app.post('/api/token', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  let claims;
  try {
    claims = await verifySupabaseJWT(accessToken);
  } catch (err) {
    console.warn('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Deterministic Direct Line user id, stable per Supabase user.
  const userId = `dl_${claims.sub}`;

  try {
    const response = await fetch(DIRECT_LINE_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIRECT_LINE_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { id: userId, name: 'User' } }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Direct Line API error ${response.status}: ${body}`);
      return res.status(502).json({ error: 'Failed to generate token' });
    }

    const data = await response.json();

    // Return only what the app needs — never expose the secret
    return res.json({
      token: data.token,
      conversationId: data.conversationId,
      expiresIn: data.expires_in,
      userId,
    });
  } catch (err) {
    console.error('Token endpoint error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
});
