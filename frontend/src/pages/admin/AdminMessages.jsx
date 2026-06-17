import React, { useState, useRef } from 'react';
import { 
  EnvelopeIcon, 
  PaperAirplaneIcon, 
  UserGroupIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UsersIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  XCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AdminMessages = () => {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const allRecipients = [
    { id: 1, name: 'Jean Kamga', role: 'Délégué', category: 'delegates', avatar: 'J', online: false },
    { id: 2, name: 'Marie Ngo', role: 'Pharmacienne', category: 'pharmacists', avatar: 'M', online: true },
    { id: 3, name: 'Dr. Pierre Fouda', role: 'Pharmacien', category: 'pharmacists', avatar: 'P', online: true },
    { id: 4, name: 'Paul Ndi', role: 'Livreur', category: 'delivery', avatar: 'P', online: false },
    { id: 5, name: 'Claire Mbarga', role: 'Déléguée', category: 'delegates', avatar: 'C', online: true },
    { id: 6, name: 'Dr. Jean Mbarga', role: 'Pharmacien', category: 'pharmacists', avatar: 'J', online: true },
    { id: 7, name: 'Robert Ndongo', role: 'Livreur', category: 'delivery', avatar: 'R', online: false },
    { id: 8, name: 'Paul Atangana', role: 'Délégué', category: 'delegates', avatar: 'P', online: true },
  ];

  const getFilteredRecipients = () => {
    let filtered = allRecipients;
    if (activeFilter !== 'all') {
      filtered = filtered.filter(r => r.category === activeFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(term) ||
        r.role.toLowerCase().includes(term)
      );
    }
    return filtered;
  };

  const recipients = getFilteredRecipients();

  // Messages avec statuts : 'sent' (1 crochet gris), 'delivered' (2 crochets gris), 'read' (2 crochets bleus)
  const [sentMessages, setSentMessages] = useState([
    { id: 1, recipient: 'Jean Kamga', recipientId: 1, message: 'Nouveau produit disponible. Consultez le catalogue.', date: '2025-06-15 10:30', status: 'read', attachments: [] },
    { id: 2, recipient: 'Marie Ngo', recipientId: 2, message: 'Mise à jour des horaires de livraison.', date: '2025-06-14 14:20', status: 'delivered', attachments: [] },
    { id: 3, recipient: 'Paul Ndi', recipientId: 4, message: 'Changement de zone pour les livraisons de Douala.', date: '2025-06-13 09:15', status: 'sent', attachments: [] },
    { id: 4, recipient: 'Claire Mbarga', recipientId: 5, message: 'Nouvelle formation disponible pour les délégués.', date: '2025-06-12 16:45', status: 'read', attachments: [] },
  ]);

  const getConversationMessages = () => {
    if (!selectedRecipient) return [];
    return sentMessages.filter(msg => msg.recipientId === selectedRecipient.id);
  };

  const conversationMessages = getConversationMessages();

  // Fonction pour simuler les statuts des messages
  const simulateMessageStatus = (messageId) => {
    // Simuler la livraison après 2 secondes
    setTimeout(() => {
      setSentMessages(prev => 
        prev.map(msg => 
          msg.id === messageId && msg.status === 'sent' 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 2000);

    // Simuler la lecture après 5 secondes (si le destinataire est en ligne)
    const recipient = allRecipients.find(r => r.id === selectedRecipient?.id);
    if (recipient?.online) {
      setTimeout(() => {
        setSentMessages(prev => 
          prev.map(msg => 
            msg.id === messageId && msg.status === 'delivered' 
              ? { ...msg, status: 'read' } 
              : msg
          )
        );
      }, 5000);
    }
  };

  const getStatusIcon = (status, isOnline) => {
    switch(status) {
      case 'read':
        return (
          <span className="text-blue-500 flex items-center">
            <CheckIcon className="h-3 w-3" />
            <CheckIcon className="h-3 w-3 -ml-1.5" />
          </span>
        );
      case 'delivered':
        return (
          <span className="text-gray-400 flex items-center">
            <CheckIcon className="h-3 w-3" />
            <CheckIcon className="h-3 w-3 -ml-1.5" />
          </span>
        );
      case 'sent':
      default:
        return (
          <span className="text-gray-400">
            <CheckIcon className="h-3 w-3" />
          </span>
        );
    }
  };

  const getStatusText = (status, isOnline) => {
    switch(status) {
      case 'read':
        return 'Lu';
      case 'delivered':
        return 'Délivré';
      case 'sent':
      default:
        return 'Envoyé';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'read':
        return 'text-blue-500';
      case 'delivered':
        return 'text-gray-400';
      case 'sent':
      default:
        return 'text-gray-400';
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.warning(`${file.name} : Format non supporté`);
        return false;
      }
      if (file.size > maxSize) {
        toast.warning(`${file.name} : Fichier trop volumineux (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newAttachments = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setAttachments([...attachments, ...newAttachments]);
      toast.success(`${validFiles.length} fichier(s) ajouté(s)`);
    }
    e.target.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <PhotoIcon className="h-4 w-4 text-blue-500" />;
    if (type === 'application/pdf') return <DocumentIcon className="h-4 w-4 text-red-500" />;
    if (type.includes('word')) return <DocumentIcon className="h-4 w-4 text-blue-600" />;
    if (type.includes('excel')) return <DocumentIcon className="h-4 w-4 text-green-600" />;
    return <DocumentIcon className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSendMessage = () => {
    if (!selectedRecipient) {
      toast.warning('Veuillez sélectionner un destinataire');
      return;
    }
    if (!message.trim() && attachments.length === 0) {
      toast.warning('Veuillez écrire un message ou ajouter un fichier');
      return;
    }

    setSending(true);
    const newMessageId = Date.now();
    const newMessage = {
      id: newMessageId,
      recipient: selectedRecipient.name,
      recipientId: selectedRecipient.id,
      message: message.trim() || '(Pièce jointe)',
      date: new Date().toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'sent', // 1 crochet gris
      attachments: attachments.map(a => ({
        name: a.name,
        size: a.size,
        type: a.type,
        preview: a.preview
      }))
    };
    
    setSentMessages([newMessage, ...sentMessages]);
    toast.success(`Message envoyé à ${selectedRecipient.name}`);
    setMessage('');
    setAttachments([]);
    setSending(false);

    // Simuler l'évolution du statut
    simulateMessageStatus(newMessageId);
  };

  const getFilterButtonClass = (filter) => {
    return activeFilter === filter
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="h-[calc(100vh-130px)]">
      <div className="flex h-full gap-6">
        {/* Colonne gauche : Discussions */}
        <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-800">Discussions</h3>
              <span className="ml-auto text-xs text-gray-400">{recipients.length} contacts</span>
            </div>
          </div>

          <div className="px-3 pt-3 pb-2 flex-shrink-0">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une discussion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 min-h-0">
            {recipients.map((recipient) => (
              <button
                key={recipient.id}
                onClick={() => {
                  setSelectedRecipient(recipient);
                  setMessage('');
                  setAttachments([]);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                  selectedRecipient?.id === recipient.id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    {recipient.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    recipient.online ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{recipient.name}</p>
                  <p className="text-xs text-gray-500">{recipient.role}</p>
                </div>
              </button>
            ))}
            {recipients.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Aucun contact trouvé</p>
                {searchTerm && (
                  <p className="text-xs mt-1">Essayez une autre recherche</p>
                )}
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-gray-50 flex-shrink-0">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${getFilterButtonClass('all')}`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveFilter('pharmacists')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${getFilterButtonClass('pharmacists')}`}
              >
                <BuildingOfficeIcon className="h-3.5 w-3.5" />
                Pharmaciens
              </button>
              <button
                onClick={() => setActiveFilter('delegates')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${getFilterButtonClass('delegates')}`}
              >
                <UsersIcon className="h-3.5 w-3.5" />
                Délégués
              </button>
              <button
                onClick={() => setActiveFilter('delivery')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${getFilterButtonClass('delivery')}`}
              >
                <TruckIcon className="h-3.5 w-3.5" />
                Livreurs
              </button>
            </div>
          </div>
        </div>

        {/* Colonne droite : Espace de messagerie */}
        <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
          {selectedRecipient ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {selectedRecipient.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    selectedRecipient.online ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{selectedRecipient.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedRecipient.online ? '🟢 En ligne' : '⚪ Hors ligne'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRecipient(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden p-4">
                {conversationMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <EnvelopeIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-500">Aucun message</p>
                    <p className="text-xs">Commencez une conversation avec {selectedRecipient.name}</p>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto space-y-3 pr-2">
                    {conversationMessages.map((msg) => (
                      <div key={msg.id} className="flex flex-col items-start">
                        <div className="max-w-[80%] bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-gray-800">{msg.message}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.attachments.map((att, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-500 bg-white/50 rounded p-1.5 px-2">
                                  {att.preview ? (
                                    <img src={att.preview} alt={att.name} className="h-8 w-8 object-cover rounded" />
                                  ) : (
                                    getFileIcon(att.type)
                                  )}
                                  <span className="truncate">{att.name}</span>
                                  <span className="text-gray-400 text-[10px]">({formatFileSize(att.size)})</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{msg.date}</span>
                            <span className={`flex items-center gap-0.5 ${getStatusColor(msg.status)}`}>
                              {getStatusIcon(msg.status, selectedRecipient?.online)}
                              <span className="text-[10px] ml-0.5">{getStatusText(msg.status, selectedRecipient?.online)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Zone de saisie avec pièces jointes */}
              <div className="p-3 border-t flex-shrink-0">
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1 text-xs">
                        {att.preview ? (
                          <img src={att.preview} alt={att.name} className="h-6 w-6 object-cover rounded" />
                        ) : (
                          getFileIcon(att.type)
                        )}
                        <span className="max-w-24 truncate">{att.name}</span>
                        <button
                          onClick={() => removeAttachment(att.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <XCircleIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title="Joindre un fichier"
                  >
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <textarea
                    rows="2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input flex-1 resize-none text-sm py-2"
                    placeholder={`Écrivez votre message à ${selectedRecipient.name}...`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || (!message.trim() && attachments.length === 0)}
                    className="btn-primary flex items-center justify-center px-5 rounded-lg flex-shrink-0"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <EnvelopeIcon className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500">Sélectionnez une discussion</p>
              <p className="text-sm">Choisissez un contact dans la liste de gauche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;