const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

http.createServer(function (req, res) {
  proxy.on('proxyRes', function (proxyRes, req, res) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  });

  proxy.web(req, res, {
    target: 'https://indexer.crossbell.io',
    changeOrigin: true,
    autoRewrite: true,
  });
}).listen(8080);

console.log("proxy listening on port 8080");
