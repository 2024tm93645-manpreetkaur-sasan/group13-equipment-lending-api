import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../utils/jwtUtils.js';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000';

// Middleware to decode JWT
const injectUserMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) req.user = { id: payload.id, role: payload.role };
  }
  next();
};

// Middleware to store raw body for proxy
const rawBodyMiddleware = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    let data = [];
    req.on('data', chunk => data.push(chunk));
    req.on('end', () => {
      req.rawBody = Buffer.concat(data);
      next();
    });
  } else {
    next();
  }
};

// Proxy middleware
const apiProxy = createProxyMiddleware({
  target: BACKEND,
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req) => {
    // Forward JWT user headers
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.id);
      proxyReq.setHeader('x-user-role', req.user.role);
    }

    // Forward raw body automatically
    if (req.rawBody && req.rawBody.length) {
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', req.rawBody.length);
      proxyReq.write(req.rawBody);
      proxyReq.end();
    }

    // Log backend URL
    console.log('➡️ Proxy forwarding request to backend URL:', `${BACKEND}${req.originalUrl}`);
  },
});

export { apiProxy, injectUserMiddleware, rawBodyMiddleware };
