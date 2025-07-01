import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, User, Mail, Shield, Calendar } from 'lucide-react';

interface UserAccount {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  joinDate: string;
  avatar: string;
  department?: string;
  phone?: string;
  address?: string;
  bio?: string;
  permissions?: string[];
}

interface UserEditorProps {
  userId?: string;
  onSave: (userData: UserAccount) => void;
  onCancel: () => void;
  initialData?: UserAccount;
}

export const UserEditor: React.FC<UserEditorProps> = ({
  userId,
  onSave,
  onCancel,
  initialData
}) => {
  const [userData, setUserData] = useState<UserAccount>({
    id: userId || '',
    name: '',
    email: '',
    role: 'student',
    status: 'active',
    lastLogin: 'Jamais',
    joinDate: new Date().toLocaleDateString('fr-FR'),
    avatar: '',
    department: '',
    phone: '',
    address: '',
    bio: '',
    permissions: [],
    ...initialData
  });

  const [isSaving, setIsSaving] = useState(false);

  const departments = [
    'Administration',
    'Intelligence Artificielle',
    'Cybersécurité',
    'Data Science',
    'Développement Web',
    'Électronique',
    'Mathématiques',
    'Physique'
  ];

  const availablePermissions = [
    'read_content',
    'write_content',
    'manage_users',
    'manage_courses',
    'manage_projects',
    'manage_events',
    'manage_media',
    'view_analytics',
    'system_settings'
  ];

  const permissionLabels: { [key: string]: string } = {
    'read_content': 'Lire le contenu',
    'write_content': 'Écrire du contenu',
    'manage_users': 'Gérer les utilisateurs',
    'manage_courses': 'Gérer les cours',
    'manage_projects': 'Gérer les projets',
    'manage_events': 'Gérer les événements',
    'manage_media': 'Gérer les médias',
    'view_analytics': 'Voir les statistiques',
    'system_settings': 'Paramètres système'
  };

  const handleInputChange = (field: keyof UserAccount, value: any) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      permissions: checked 
        ? [...(prev.permissions || []), permission]
        : (prev.permissions || []).filter(p => p !== permission)
    }));
  };

  const generateAvatar = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return name.slice(0, 2);
  };

  useEffect(() => {
    if (userData.name && !userData.avatar) {
      setUserData(prev => ({
        ...prev,
        avatar: generateAvatar(prev.name).toUpperCase()
      }));
    }
  }, [userData.name]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...userData,
        id: userId || Date.now().toString(),
        avatar: userData.avatar || generateAvatar(userData.name).toUpperCase()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(dataToSave);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {userId ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h1>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Informations personnelles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Prénom Nom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@esst.edu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={userData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <select
                    value={userData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={userData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    value={userData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Présentation de l'utilisateur..."
                  />
                </div>
              </div>
            </div>

            {/* Rôle et statut */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Rôle et statut</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={userData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">Étudiant</option>
                    <option value="teacher">Enseignant</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    value={userData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {userData.avatar || generateAvatar(userData.name || 'U').toUpperCase()}
                    </div>
                    <input
                      type="text"
                      value={userData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Initiales"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            {userData.role === 'admin' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Permissions</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {availablePermissions.map(permission => (
                    <div key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(userData.permissions || []).includes(permission)}
                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                        className="rounded border-gray-300 mr-3"
                      />
                      <label className="text-sm text-gray-700">
                        {permissionLabels[permission]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informations système */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations système</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'inscription
                  </label>
                  <input
                    type="date"
                    value={userData.joinDate ? new Date(userData.joinDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dernière connexion
                  </label>
                  <input
                    type="text"
                    value={userData.lastLogin}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Actions de sécurité */}
            {userId && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions de sécurité</h3>
                
                <div className="space-y-4">
                  <button className="w-full md:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Réinitialiser le mot de passe
                  </button>
                  
                  <button className="w-full md:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors ml-0 md:ml-3">
                    Forcer la déconnexion
                  </button>
                  
                  <button className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-0 md:ml-3">
                    Suspendre le compte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};