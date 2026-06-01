const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folder = 'uploads/';
    
    // Déterminer le dossier en fonction du type de fichier
    if (file.fieldname === 'avatar') {
      folder += 'avatars/';
    } else if (file.fieldname === 'idCard') {
      folder += 'id-cards/';
    } else if (file.fieldname === 'productImage') {
      folder += 'products/';
    } else {
      folder += 'misc/';
    }
    
    cb(null, folder);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
  }
};

// Configuration multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Middleware pour l'upload d'avatar
const uploadAvatar = upload.single('avatar');

// Middleware pour l'upload de carte d'identité
const uploadIdCard = upload.single('idCard');

// Middleware pour l'upload de produit
const uploadProductImage = upload.single('productImage');

// Middleware pour l'upload multiple
const uploadMultiple = upload.array('images', 5);

module.exports = {
  uploadAvatar,
  uploadIdCard,
  uploadProductImage,
  uploadMultiple
};