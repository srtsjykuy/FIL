import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Eye, Image as ImageIcon, Plus, X } from 'lucide-react';

interface NewsArticle {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  featuredImage: string;
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
}

interface NewsEditorProps {
  newsId?: string;
  onSave: (articleData: NewsArticle) => void;
  onCancel: () => void;
  initialData?: NewsArticle;
}

export const NewsEditor: React.FC<NewsEditorProps> = ({
  newsId,
  onSave,
  onCancel,
  initialData
}) => {
  const [articleData, setArticleData] = useState<NewsArticle>({
    id: newsId || '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Actualités',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    featuredImage: '',
    tags: [],
    seoTitle: '',
    metaDescription: '',
    ...initialData
  });

  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Actualités',
    'Distinctions',
    'Formation',
    'Partenariats',
    'Recherche',
    'Événements',
    'Campus',
    'International'
  ];

  const handleInputChange = (field: keyof NewsArticle, value: any) => {
    setArticleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !articleData.tags.includes(newTag.trim())) {
      setArticleData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setArticleData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (status?: 'published' | 'draft' | 'scheduled') => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...articleData,
        status: status || articleData.status,
        id: newsId || Date.now().toString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(dataToSave);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
            {trimmedLine.slice(2)}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 mb-3 mt-5">
            {trimmedLine.slice(3)}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mb-2 mt-4">
            {trimmedLine.slice(4)}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-1 text-gray-700 list-disc">
            {trimmedLine.slice(2)}
          </li>
        );
      } else if (trimmedLine.length > 0) {
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {trimmedLine}
          </p>
        );
      } else {
        return <br key={index} />;
      }
    });
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
              {newsId ? 'Modifier l\'article' : 'Nouvel article'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? 'Éditer' : 'Aperçu'}
            </button>
            
            <button
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Brouillon'}
            </button>
            
            <button
              onClick={() => handleSave('published')}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              {!isPreview ? (
                <div className="p-6">
                  {/* Title */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'article *
                    </label>
                    <input
                      type="text"
                      value={articleData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez le titre de l'article"
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Résumé *
                    </label>
                    <textarea
                      value={articleData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Résumé de l'article (affiché dans les listes)"
                      required
                    />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu *
                    </label>
                    <textarea
                      value={articleData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Rédigez le contenu de votre article ici... Vous pouvez utiliser Markdown."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Vous pouvez utiliser Markdown pour formater votre texte (# pour les titres, - pour les listes, etc.)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {articleData.featuredImage && (
                    <img
                      src={articleData.featuredImage}
                      alt={articleData.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{articleData.title}</h1>
                  <p className="text-lg text-gray-600 mb-6">{articleData.excerpt}</p>
                  <div className="prose max-w-none">
                    {renderContent(articleData.content)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publication Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={articleData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="scheduled">Programmé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={articleData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={articleData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de l'auteur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={articleData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image mise en avant</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    value={articleData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {articleData.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={articleData.featuredImage}
                      alt="Aperçu"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
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
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {articleData.tags.map((tag, index) => (
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

            {/* SEO */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    value={articleData.seoTitle || ''}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Titre pour les moteurs de recherche"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(articleData.seoTitle || articleData.title).length}/60 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={articleData.metaDescription || ''}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Description pour les moteurs de recherche"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(articleData.metaDescription || '').length}/160 caractères
                  </p>
                </div>
              </div>
            </div>

            {/* Article Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Mots:</span>
                  <span>{articleData.content.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Caractères:</span>
                  <span>{articleData.content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps de lecture:</span>
                  <span>{Math.max(1, Math.ceil(articleData.content.split(/\s+/).length / 200))} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};