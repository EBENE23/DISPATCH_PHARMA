const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Générer un code aléatoire à 6 chiffres
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Envoyer un email de vérification (2FA)
const sendVerificationCode = async (email, fullName, code) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #00aa69 0%, #008854 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; text-align: center; }
        .code { font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #00aa69; background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; font-family: monospace; }
        .info { color: #666; font-size: 14px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
        .warning { color: #e74c3c; font-size: 12px; margin-top: 20px; }
        button { background: #00aa69; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 DISPATCH PHARMA</h1>
          <p>L'innovation au service des délégués médicaux</p>
        </div>
        <div class="content">
          <h2>Bonjour ${fullName} !</h2>
          <p>Nous avons reçu une demande de connexion à votre compte.</p>
          <p>Voici votre code de validation :</p>
          <div class="code">${code}</div>
          <p class="info">Ce code expire dans <strong>5 minutes</strong>.</p>
          <p>Si vous n'êtes pas à l'origine de cette connexion, veuillez ignorer cet email.</p>
          <p class="warning">⚠️ Ne partagez jamais ce code avec personne.</p>
        </div>
        <div class="footer">
          <p>© 2025 DISPATCH PHARMA - Tous droits réservés</p>
          <p>Application sécurisée - Authentification à deux facteurs</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"DISPATCH PHARMA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Votre code de validation DISPATCH PHARMA',
    html: html,
    text: `Votre code de validation DISPATCH PHARMA est : ${code}. Ce code expire dans 5 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email de vérification envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return false;
  }
};

// Envoyer un email d'invitation (création de compte)
const sendInvitationEmail = async (email, fullName, role, tempToken) => {
  const roleLabels = {
    delegate: 'Délégué Médical',
    pharmacist: 'Pharmacien Hospitalier',
    delivery: 'Livreur'
  };

  const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/activate?token=${tempToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #00aa69 0%, #008854 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; text-align: center; }
        .btn { display: inline-block; background: #00aa69; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .info { color: #666; font-size: 14px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 DISPATCH PHARMA</h1>
          <p>L'innovation au service des délégués médicaux</p>
        </div>
        <div class="content">
          <h2>Bienvenue ${fullName} !</h2>
          <p>Un compte <strong>${roleLabels[role]}</strong> a été créé pour vous.</p>
          <a href="${inviteLink}" class="btn">🔑 Activer mon compte</a>
          <p class="info">Ce lien expire dans <strong>48 heures</strong>.</p>
          <p>Après activation, vous pourrez vous connecter à l'application.</p>
        </div>
        <div class="footer">
          <p>© 2025 DISPATCH PHARMA</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"DISPATCH PHARMA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Invitation à rejoindre DISPATCH PHARMA',
    html: html,
    text: `Bonjour ${fullName}, un compte ${roleLabels[role]} a été créé pour vous. Activez-le ici : ${inviteLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email d'invitation envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi invitation:', error);
    return false;
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationCode,
  sendInvitationEmail
};