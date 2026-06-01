const Message = require('../models/Message');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// Clé de chiffrement
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// ========== CHIFFRER UN MESSAGE ==========
const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
};

// ========== DÉCHIFFRER UN MESSAGE ==========
const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// ========== ENVOYER UN MESSAGE ==========
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.userId;

    // Vérifier si le destinataire existe
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé'
      });
    }

    // Chiffrer le message
    const encryptedMessage = encryptMessage(message);

    const newMessage = new Message({
      senderId,
      receiverId,
      message: encryptedMessage,
      isEncrypted: true
    });

    await newMessage.save();

    // Retourner le message déchiffré pour l'affichage immédiat
    res.status(201).json({
      success: true,
      message: 'Message envoyé',
      data: {
        id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        message: message, // Version déchiffrée
        createdAt: newMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};

// ========== RÉCUPÉRER LES MESSAGES D'UNE CONVERSATION ==========
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'fullName avatar role')
    .populate('receiverId', 'fullName avatar role');

    // Déchiffrer les messages
    const decryptedMessages = messages.map(msg => ({
      ...msg.toObject(),
      message: decryptMessage(msg.message)
    }));

    // Marquer les messages comme lus
    await Message.updateMany(
      { senderId: userId, receiverId: currentUserId, isRead: false },
      { $set: { isRead: true, readAt: Date.now() } }
    );

    res.json({
      success: true,
      messages: decryptedMessages
    });

  } catch (error) {
    console.error('Erreur récupération conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message
    });
  }
};

// ========== RÉCUPÉRER LA LISTE DES CONVERSATIONS ==========
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Récupérer tous les utilisateurs avec qui j'ai eu une conversation
    const sentTo = await Message.distinct('receiverId', { senderId: currentUserId });
    const receivedFrom = await Message.distinct('senderId', { receiverId: currentUserId });
    
    const allUserIds = [...new Set([...sentTo, ...receivedFrom])];

    // Exclure moi-même
    const conversationUsers = await User.find({
      _id: { $in: allUserIds, $ne: currentUserId }
    }).select('fullName email avatar role');

    // Récupérer le dernier message pour chaque conversation
    const conversations = await Promise.all(conversationUsers.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: currentUserId, receiverId: user._id },
          { senderId: user._id, receiverId: currentUserId }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(1);

      const unreadCount = await Message.countDocuments({
        senderId: user._id,
        receiverId: currentUserId,
        isRead: false
      });

      return {
        user: user,
        lastMessage: lastMessage ? decryptMessage(lastMessage.message) : null,
        lastMessageDate: lastMessage?.createdAt,
        unreadCount: unreadCount
      };
    }));

    // Trier par date du dernier message
    conversations.sort((a, b) => {
      if (!a.lastMessageDate) return 1;
      if (!b.lastMessageDate) return -1;
      return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
    });

    res.json({
      success: true,
      conversations: conversations
    });

  } catch (error) {
    console.error('Erreur récupération conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des conversations',
      error: error.message
    });
  }
};

// ========== MARQUER TOUS LES MESSAGES COMME LUS ==========
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const currentUserId = req.userId;

    await Message.updateMany(
      { senderId: senderId, receiverId: currentUserId, isRead: false },
      { $set: { isRead: true, readAt: Date.now() } }
    );

    res.json({
      success: true,
      message: 'Messages marqués comme lus'
    });

  } catch (error) {
    console.error('Erreur marquage lu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage des messages',
      error: error.message
    });
  }
};

// ========== OBTENIR LE NOMBRE DE MESSAGES NON LUS ==========
exports.getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const unreadCount = await Message.countDocuments({
      receiverId: currentUserId,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount: unreadCount
    });

  } catch (error) {
    console.error('Erreur comptage non lus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des messages',
      error: error.message
    });
  }
};