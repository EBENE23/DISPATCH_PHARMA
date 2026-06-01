const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
};

const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = (io) => {
  // Middleware d'authentification Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id fullName email role avatar');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Utilisateur connecté: ${socket.user.fullName} (${socket.user.role})`);
    
    // Rejoindre sa propre room (pour messages privés)
    socket.join(`user_${socket.userId}`);
    
    // Événement: envoyer un message privé
    socket.on('private_message', async (data) => {
      try {
        const { receiverId, message } = data;
        
        // Vérifier que le destinataire existe
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit('error', { message: 'Destinataire non trouvé' });
          return;
        }
        
        // Chiffrer le message
        const encryptedMessage = encryptMessage(message);
        
        // Sauvegarder en base de données
        const newMessage = new Message({
          senderId: socket.userId,
          receiverId: receiverId,
          message: encryptedMessage,
          isEncrypted: true
        });
        
        await newMessage.save();
        
        // Préparer la réponse
        const messageData = {
          id: newMessage._id,
          senderId: socket.userId,
          receiverId: receiverId,
          message: message, // Version déchiffrée pour l'affichage
          senderName: socket.user.fullName,
          senderAvatar: socket.user.avatar,
          createdAt: newMessage.createdAt
        };
        
        // Envoyer à l'expéditeur
        socket.emit('message_sent', messageData);
        
        // Envoyer au destinataire (si connecté)
        io.to(`user_${receiverId}`).emit('new_message', messageData);
        
        // Notifier le destinataire du nombre de messages non lus
        const unreadCount = await Message.countDocuments({
          receiverId: receiverId,
          isRead: false,
          senderId: { $ne: receiverId }
        });
        
        io.to(`user_${receiverId}`).emit('unread_count', { count: unreadCount });
        
      } catch (error) {
        console.error('Erreur envoi message privé:', error);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });
    
    // Événement: marquer comme lu
    socket.on('mark_as_read', async (data) => {
      try {
        const { senderId } = data;
        
        await Message.updateMany(
          { senderId: senderId, receiverId: socket.userId, isRead: false },
          { $set: { isRead: true, readAt: Date.now() } }
        );
        
        // Mettre à jour le compteur
        const unreadCount = await Message.countDocuments({
          receiverId: socket.userId,
          isRead: false
        });
        
        socket.emit('unread_count', { count: unreadCount });
        io.to(`user_${senderId}`).emit('messages_read', { readerId: socket.userId });
        
      } catch (error) {
        console.error('Erreur marquage lu:', error);
      }
    });
    
    // Événement: l'utilisateur tape...
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      io.to(`user_${receiverId}`).emit('user_typing', {
        senderId: socket.userId,
        senderName: socket.user.fullName,
        isTyping: isTyping
      });
    });
    
    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`🔌 Utilisateur déconnecté: ${socket.user.fullName}`);
    });
  });
};