import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/create-mt5-account', async (req, res) => {
  const token = process.env.METAAPI_TOKEN;
  const { login, password, server } = req.body;

  if (!token || !login || !password || !server) {
    return res.status(400).json({ error: 'Missing parameters or token' });
  }

  try {
    const response = await fetch('https://mt-provisioning-api-v1.agiliumtrade.ai/users/current/accounts', {
      method: 'POST',
      headers: {
        'auth-token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${login}@${server}`,
        login,
        password,
        server,
        type: 'cloud',
        region: 'london'
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed', detail: error.message });
  }
});

export default router;
