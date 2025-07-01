import React, { useState } from 'react';
import { Smile, Heart, ThumbsUp, Star, Coffee, Book } from 'lucide-react';

interface Sticker {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

interface StickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onStickerSelect: (sticker: Sticker) => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  isOpen,
  onClose,
  onStickerSelect
}) => {
  const [activeCategory, setActiveCategory] = useState('smileys');

  const categories = [
    { id: 'smileys', label: 'Smileys', icon: Smile },
    { id: 'hearts', label: 'Cœurs', icon: Heart },
    { id: 'gestures', label: 'Gestes', icon: ThumbsUp },
    { id: 'objects', label: 'Objets', icon: Star },
    { id: 'food', label: 'Nourriture', icon: Coffee },
    { id: 'activities', label: 'Activités', icon: Book }
  ];

  const stickers: { [key: string]: Sticker[] } = {
    smileys: [
      { id: '1', emoji: '😀', name: 'Sourire', category: 'smileys' },
      { id: '2', emoji: '😂', name: 'Rire', category: 'smileys' },
      { id: '3', emoji: '😍', name: 'Amoureux', category: 'smileys' },
      { id: '4', emoji: '🤔', name: 'Réfléchir', category: 'smileys' },
      { id: '5', emoji: '😎', name: 'Cool', category: 'smileys' },
      { id: '6', emoji: '😴', name: 'Dormir', category: 'smileys' },
      { id: '7', emoji: '🤯', name: 'Explosion', category: 'smileys' },
      { id: '8', emoji: '😅', name: 'Gêné', category: 'smileys' },
      { id: '9', emoji: '🥳', name: 'Fête', category: 'smileys' },
      { id: '10', emoji: '🤓', name: 'Intello', category: 'smileys' }
    ],
    hearts: [
      { id: '11', emoji: '❤️', name: 'Cœur rouge', category: 'hearts' },
      { id: '12', emoji: '💙', name: 'Cœur bleu', category: 'hearts' },
      { id: '13', emoji: '💚', name: 'Cœur vert', category: 'hearts' },
      { id: '14', emoji: '💛', name: 'Cœur jaune', category: 'hearts' },
      { id: '15', emoji: '🧡', name: 'Cœur orange', category: 'hearts' },
      { id: '16', emoji: '💜', name: 'Cœur violet', category: 'hearts' },
      { id: '17', emoji: '🖤', name: 'Cœur noir', category: 'hearts' },
      { id: '18', emoji: '💕', name: 'Deux cœurs', category: 'hearts' }
    ],
    gestures: [
      { id: '19', emoji: '👍', name: 'Pouce en haut', category: 'gestures' },
      { id: '20', emoji: '👎', name: 'Pouce en bas', category: 'gestures' },
      { id: '21', emoji: '👏', name: 'Applaudir', category: 'gestures' },
      { id: '22', emoji: '🙏', name: 'Prier', category: 'gestures' },
      { id: '23', emoji: '✌️', name: 'Victoire', category: 'gestures' },
      { id: '24', emoji: '🤝', name: 'Serrer la main', category: 'gestures' },
      { id: '25', emoji: '💪', name: 'Muscle', category: 'gestures' },
      { id: '26', emoji: '🤞', name: 'Croiser les doigts', category: 'gestures' }
    ],
    objects: [
      { id: '27', emoji: '⭐', name: 'Étoile', category: 'objects' },
      { id: '28', emoji: '🎉', name: 'Confettis', category: 'objects' },
      { id: '29', emoji: '🎯', name: 'Cible', category: 'objects' },
      { id: '30', emoji: '🏆', name: 'Trophée', category: 'objects' },
      { id: '31', emoji: '🎓', name: 'Diplôme', category: 'objects' },
      { id: '32', emoji: '💡', name: 'Ampoule', category: 'objects' },
      { id: '33', emoji: '🔥', name: 'Feu', category: 'objects' },
      { id: '34', emoji: '⚡', name: 'Éclair', category: 'objects' }
    ],
    food: [
      { id: '35', emoji: '☕', name: 'Café', category: 'food' },
      { id: '36', emoji: '🍕', name: 'Pizza', category: 'food' },
      { id: '37', emoji: '🍔', name: 'Burger', category: 'food' },
      { id: '38', emoji: '🍰', name: 'Gâteau', category: 'food' },
      { id: '39', emoji: '🍎', name: 'Pomme', category: 'food' },
      { id: '40', emoji: '🥐', name: 'Croissant', category: 'food' },
      { id: '41', emoji: '🍫', name: 'Chocolat', category: 'food' },
      { id: '42', emoji: '🍪', name: 'Cookie', category: 'food' }
    ],
    activities: [
      { id: '43', emoji: '📚', name: 'Livres', category: 'activities' },
      { id: '44', emoji: '💻', name: 'Ordinateur', category: 'activities' },
      { id: '45', emoji: '🎮', name: 'Jeu vidéo', category: 'activities' },
      { id: '46', emoji: '🎵', name: 'Musique', category: 'activities' },
      { id: '47', emoji: '🏃', name: 'Courir', category: 'activities' },
      { id: '48', emoji: '🎨', name: 'Art', category: 'activities' },
      { id: '49', emoji: '📝', name: 'Écrire', category: 'activities' },
      { id: '50', emoji: '🔬', name: 'Science', category: 'activities' }
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80 z-50">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Stickers et émojis</h3>
      </div>

      {/* Categories */}
      <div className="flex border-b border-gray-200">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 p-2 text-center transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={category.label}
            >
              <Icon className="h-4 w-4 mx-auto" />
            </button>
          );
        })}
      </div>

      {/* Stickers Grid */}
      <div className="p-3 max-h-48 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {stickers[activeCategory]?.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => onStickerSelect(sticker)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
              title={sticker.name}
            >
              {sticker.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Cliquez sur un émoji pour l'envoyer
        </p>
      </div>
    </div>
  );
};