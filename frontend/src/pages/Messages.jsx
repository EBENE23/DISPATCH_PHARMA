import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/api';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialiser Socket.io
  useEffect(() => {
    const token = localStorage.getItem('token');
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token }
    });

    socketRef.current.on('new_message', (data) => {
      if (selectedConversation?.user?._id === data.senderId) {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
      }
      loadConversations();
    });

    socketRef.current.on('user_typing', (data) => {
      if (selectedConversation?.user?._id === data.senderId) {
        setIsUserTyping(data.isTyping);
      }
    });

    socketRef.current.on('unread_count', (data) => {
      // Mettre à jour le compteur de messages non lus
      loadConversations();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedConversation]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await messageService.getConversation(userId);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      socketRef.current.emit('private_message', {
        receiverId: selectedConversation.user._id,
        message: newMessage
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!typing && selectedConversation) {
      setTyping(true);
      socketRef.current.emit('typing', {
        receiverId: selectedConversation.user._id,
        isTyping: true
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      if (selectedConversation) {
        socketRef.current.emit('typing', {
          receiverId: selectedConversation.user._id,
          isTyping: false
        });
      }
    }, 1000);
  };

  const getAvatarUrl = (conv) => {
    if (conv.user?.avatar) return conv.user.avatar;
    const role = conv.user?.role;
    if (role === 'delegate') return '/images/avatars/delegate-default.png';
    if (role === 'pharmacist') return '/images/avatars/pharmacist-default.png';
    if (role === 'delivery') return '/images/avatars/delivery-default.png';
    return '/images/avatars/default-avatar.png';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex">
      {/* Liste des conversations */}
      <div className="w-80 border-r bg-white rounded-l-xl overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Messages</h2>
          <p className="text-sm text-gray-500">{conversations.length} conversation(s)</p>
        </div>
        
        <div className="divide-y">
          {conversations.map((conv) => (
            <button
              key={conv.user._id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                selectedConversation?.user._id === conv.user._id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={getAvatarUrl(conv)}
                  alt={conv.user.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => e.target.src = '/images/avatars/default-avatar.png'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate">{conv.user.fullName}</p>
                    {conv.lastMessageDate && (
                      <span className="text-xs text-gray-400">
                        {new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'Aucun message'}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
          
          {conversations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <UserCircleIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucune conversation</p>
              <p className="text-sm">Commencez à discuter avec vos médecins</p>
            </div>
          )}
        </div>
      </div>

      {/* Zone de chat */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-gray-50 rounded-r-xl">
          {/* En-tête */}
          <div className="p-4 border-b bg-white rounded-tr-xl flex items-center gap-3">
            <img
              src={getAvatarUrl(selectedConversation)}
              alt={selectedConversation.user.fullName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => e.target.src = '/images/avatars/default-avatar.png'}
            />
            <div>
              <p className="font-semibold">{selectedConversation.user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{selectedConversation.user.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => {
              const isOwn = msg.senderId === user?._id;
              return (
                <div key={msg.id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isOwn ? 'bg-primary-500 text-white' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {isUserTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Formulaire d'envoi */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-br-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Écrivez votre message..."
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="btn-primary px-4 py-2"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-r-xl">
          <div className="text-center">
            <UserCircleIcon className="h-16 w-16 mx-auto text-gray-300" />
            <p className="text-gray-500 mt-2">Sélectionnez une conversation</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;