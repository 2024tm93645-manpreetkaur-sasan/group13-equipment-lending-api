import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../utils/jwtUtils.js';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000';

const injectUserHeaders = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const payload = verifyToken(authHeader.split(' ')[1]);
    if (payload) req.user = { id: payload.id, role: payload.role };
  }

  if (req.headers['x-forward-user-id']) {
    req.user = {
      id: req.headers['x-forward-user-id'],
      role: req.headers['x-forward-user-role'] || process.env.DEFAULT_USER_ROLE,
    };
  }

  if (req.user) {
    req.headers['x-user-id'] = req.user.id;
    req.headers['x-user-role'] = req.user.role;
  }

  next();
};

export default [
  injectUserHeaders,
  createProxyMiddleware({
    target: BACKEND,
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id);
        proxyReq.setHeader('x-user-role', req.user.role);
      }
    },
  }),
];
