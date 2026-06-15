const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');

dotenv.config();

function postJSON(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(out) });
        } catch (e) {
          resolve({ status: res.statusCode, body: out });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const loginRes = await postJSON('/api/auth/login', { email: 'admin.test@dispatchpharma.com', password: 'Admin123!' });
    console.log('LOGIN_STATUS', loginRes.status);
    console.log('LOGIN_BODY', JSON.stringify(loginRes.body, null, 2));

    const user = await User.findOne({ email: 'admin.test@dispatchpharma.com' }).lean();
    console.log('DB_USER_ROLE', user && user.role);
    console.log('DB_VERIF_CODE', user && user.verificationCode);

    const verifyRes = await postJSON('/api/auth/verify-code', {
      tempToken: loginRes.body.tempToken,
      code: user.verificationCode
    });
    console.log('VERIFY_STATUS', verifyRes.status);
    console.log('VERIFY_BODY', JSON.stringify(verifyRes.body, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
