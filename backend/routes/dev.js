const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Endpoint dev pour créer un utilisateur test (actif)
router.post('/seed-admin', async (req, res) => {
  try {
    const { email, fullName, password, role = 'admin' } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ success: false, message: 'email, fullName et password requis' });

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Utilisateur existe déjà' });

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS || 10));
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      fullName,
      password: hashed,
      role,
      isActive: true,
      accountStatus: 'active'
    });

    await user.save();
    res.json({ success: true, message: 'Utilisateur seedé', userId: user._id });
  } catch (err) {
    console.error('Erreur seed-admin:', err);
    res.status(500).json({ success: false, message: 'Erreur interne', error: err.message });
  }
});

module.exports = router;
