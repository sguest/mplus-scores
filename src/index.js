import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(createProxyMiddleware({
    target: 'https://worldofwarcraft.com',
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['access-control-allow-origin'] = '*';
    }
}));
app.listen(3000);