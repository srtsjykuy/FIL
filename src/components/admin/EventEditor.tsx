import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Calendar, MapPin, Users, Clock, Plus, X } from 'lucide-react';

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxAttendees: number;
  currentAttendees: number;
  organizer: string;
  image: string;
  tags: string[];
  registrationRequired: boolean;
  registrationDeadline?: string;
  price?: number;
  agenda: Array<{
    id: string;
    time: string;
    title: string;
    speaker?: string;
    description?: string;
  }>;
}

interface EventEditorProps {
  eventId?: string;
  onSave: (eventData: Event) => void;
  onCancel: () => void;
  initialData?: Event;
}

export const EventEditor: React.FC<EventEditorProps> = ({
  eventId,
  onSave,
  onCancel,
  initialData
}) => {
  const [eventData, setEventData] = useState<Event>({
    id: eventId || '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Conférence',
    status: 'upcoming',
    maxAttendees: 100,
    currentAttendees: 0,
    organizer: '',
    image: '',
    tags: [],
    registrationRequired: false,
    agenda: [],
    ...initialData
  });

  const [newTag, setNewTag] = useState('');
  const [newAgendaItem, setNewAgendaItem] = useState({
    time: '',
    title: '',
    speaker: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Conférence',
    'Workshop',
    'Séminaire',
    'Formation',
    'Événement',
    'Webinaire',
    'Table ronde',
    'Networking'
  ];

  const handleInputChange = (field: keyof Event, value: any) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !eventData.tags.includes(newTag.trim())) {
      setEventData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEventData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAgendaItem = () => {
    if (newAgendaItem.time && newAgendaItem.title) {
      const agendaItem = {
        id: Date.now().toString(),
        ...newAgendaItem
      };
      setEventData(prev => ({
        ...prev,
        agenda: [...prev.agenda, agendaItem].sort((a, b) => a.time.localeCompare(b.time))
      }));
      setNewAgendaItem({ time: '', title: '', speaker: '', description: '' });
    }
  };

  const removeAgendaItem = (itemId: string) => {
    setEventData(prev => ({
      ...prev,
      agenda: prev.agenda.filter(item => item.id !== itemId)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...eventData,
        id: eventId || Date.now().toString()
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
              {eventId ? 'Modifier l\'événement' : 'Nouvel événement'}
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
            {/* Informations générales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations générales</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    value={eventData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de l'événement"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={eventData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    value={eventData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Lieu de l'événement"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={eventData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisateur *
                  </label>
                  <input
                    type="text"
                    value={eventData.organizer}
                    onChange={(e) => handleInputChange('organizer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de l'organisateur"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre max de participants
                  </label>
                  <input
                    type="number"
                    value={eventData.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={eventData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="upcoming">À venir</option>
                    <option value="ongoing">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description détaillée de l'événement..."
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de l'événement (URL)
                </label>
                <input
                  type="url"
                  value={eventData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {eventData.image && (
                  <div className="mt-3">
                    <img
                      src={eventData.image}
                      alt="Aperçu"
                      className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Inscription */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Inscription</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={eventData.registrationRequired}
                    onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
                    className="rounded border-gray-300 mr-3"
                  />
                  <label className="text-sm text-gray-700">
                    Inscription requise
                  </label>
                </div>

                {eventData.registrationRequired && (
                  <div className="grid md:grid-cols-2 gap-6 ml-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date limite d'inscription
                      </label>
                      <input
                        type="date"
                        value={eventData.registrationDeadline || ''}
                        onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (€)
                      </label>
                      <input
                        type="number"
                        value={eventData.price || 0}
                        onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Programme */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Programme</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Ajouter un élément au programme</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <input
                    type="time"
                    value={newAgendaItem.time}
                    onChange={(e) => setNewAgendaItem(prev => ({ ...prev, time: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Heure"
                  />
                  <input
                    type="text"
                    value={newAgendaItem.title}
                    onChange={(e) => setNewAgendaItem(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Titre"
                  />
                  <input
                    type="text"
                    value={newAgendaItem.speaker}
                    onChange={(e) => setNewAgendaItem(prev => ({ ...prev, speaker: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Intervenant (optionnel)"
                  />
                  <button
                    onClick={addAgendaItem}
                    disabled={!newAgendaItem.time || !newAgendaItem.title}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Ajouter
                  </button>
                </div>
                <textarea
                  value={newAgendaItem.description}
                  onChange={(e) => setNewAgendaItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Description (optionnel)"
                />
              </div>
              
              <div className="space-y-3">
                {eventData.agenda.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            {item.time}
                          </span>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          {item.speaker && (
                            <span className="text-sm text-gray-500">par {item.speaker}</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeAgendaItem(item.id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajouter un tag..."
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};