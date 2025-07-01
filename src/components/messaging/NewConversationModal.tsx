import React, { useState } from 'react';
import { X, Search, Users, User, Plus } from 'lucide-react';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (participants: string[], name?: string, type?: 'individual' | 'group', conversationType?: string) => string;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onCreateConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [conversationType, setConversationType] = useState<'individual' | 'group'>('individual');
  const [groupName, setGroupName] = useState('');

  // Mock users for demonstration
  const availableUsers = [
    { id: '1', name: 'Prof. Marie Dubois', email: 'marie.dubois@esst.edu', avatar: 'MD', role: 'Professeur', isOnline: true },
    { id: '2', name: 'Thomas Lambert', email: 'thomas.lambert@student.esst.edu', avatar: 'TL', role: 'Étudiant', isOnline: false },
    { id: '3', name: 'Sophie Martin', email: 'sophie.martin@student.esst.edu', avatar: 'SM', role: 'Étudiant', isOnline: true },
    { id: '4', name: 'Alex Chen', email: 'alex.chen@student.esst.edu', avatar: 'AC', role: 'Étudiant', isOnline: false },
    { id: '5', name: 'Dr. Jean Martin', email: 'jean.martin@esst.edu', avatar: 'JM', role: 'Docteur', isOnline: true },
    { id: '6', name: 'Emma Rousseau', email: 'emma.rousseau@student.esst.edu', avatar: 'ER', role: 'Étudiant', isOnline: true },
    { id: '7', name: 'Lucas Moreau', email: 'lucas.moreau@student.esst.edu', avatar: 'LM', role: 'Étudiant', isOnline: false },
    { id: '8', name: 'Camille Bernard', email: 'camille.bernard@student.esst.edu', avatar: 'CB', role: 'Étudiant', isOnline: true }
  ];

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleCreateConversation = () => {
    if (selectedUsers.length === 0) return;

    const type = selectedUsers.length === 1 ? 'individual' : 'group';
    const name = type === 'group' ? groupName || 'Nouvelle conversation' : undefined;
    
    onCreateConversation(selectedUsers, name, type);
    
    // Reset form
    setSelectedUsers([]);
    setGroupName('');
    setSearchTerm('');
    setConversationType('individual');
    onClose();
  };

  const selectedUsersData = availableUsers.filter(user => selectedUsers.includes(user.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nouvelle conversation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher des utilisateurs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Participants sélectionnés ({selectedUsers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedUsersData.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user.avatar}
                    </div>
                    <span>{user.name}</span>
                    <button
                      onClick={() => handleUserSelect(user.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group Name (if multiple users selected) */}
          {selectedUsers.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du groupe (optionnel)
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom du groupe de discussion"
              />
            </div>
          )}

          {/* Users List */}
          <div className="max-h-80 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Utilisateurs disponibles
            </h3>
            <div className="space-y-2">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.avatar}
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role} • {user.email}</p>
                  </div>
                  <div className="flex items-center">
                    {selectedUsers.includes(user.id) && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Plus className="h-3 w-3 text-white transform rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedUsers.length === 0 ? (
              'Sélectionnez au moins un utilisateur'
            ) : selectedUsers.length === 1 ? (
              'Conversation individuelle'
            ) : (
              `Groupe de ${selectedUsers.length} participants`
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateConversation}
              disabled={selectedUsers.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Créer la conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};