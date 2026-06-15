const http = require('http');
const data = JSON.stringify({ email: 'admin.test@dispatchpharma.com', fullName: 'Admin Test', password: 'Admin123!' });
const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/dev/seed-admin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(body);
  });
});
req.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
req.write(data);
req.end();
