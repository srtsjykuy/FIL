import React, { useState, useRef } from 'react';
import { Upload, X, Image, File, Video, ArrowLeft, Save } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  url: string;
  uploadDate: string;
  uploadedBy: string;
  folder: string;
}

interface MediaUploaderProps {
  onSave: (mediaData: MediaFile) => void;
  onCancel: () => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onSave,
  onCancel
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [folder, setFolder] = useState('Documents');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ['Campus', 'Laboratoires', 'Événements', 'Documents', 'Formations'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const getFileIcon = (file: File) => {
    const type = getFileType(file);
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simuler l'upload de chaque fichier
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Simuler le progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(((i * 100) + progress) / selectedFiles.length);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Créer l'objet média
        const mediaData: MediaFile = {
          id: Date.now().toString() + i,
          name: file.name,
          type: getFileType(file),
          size: formatFileSize(file.size),
          url: URL.createObjectURL(file), // En production, ce serait l'URL du serveur
          uploadDate: new Date().toLocaleDateString('fr-FR'),
          uploadedBy: 'Admin',
          folder: folder
        };

        onSave(mediaData);
      }

      // Réinitialiser après upload
      setSelectedFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setIsUploading(false);
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
              Télécharger des fichiers
            </h1>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Upload en cours...' : `Télécharger (${selectedFiles.length})`}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Upload Area */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Glissez-déposez vos fichiers ici
                </h3>
                <p className="text-gray-600 mb-4">
                  ou cliquez pour sélectionner des fichiers
                </p>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choisir des fichiers
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Formats supportés: Images, Vidéos, PDF, Documents Office, Archives
                </p>
              </div>
            </div>
          </div>

          {/* Folder Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dossier de destination</h3>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {folders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fichiers sélectionnés ({selectedFiles.length})
              </h3>
              
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {getFileType(file)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression de l'upload</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(uploadProgress)}% complété
              </p>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Conseils d'upload</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Taille maximale par fichier: 50 MB</li>
              <li>• Pour les images: utilisez des formats JPG, PNG ou WebP</li>
              <li>• Pour les documents: PDF, DOC, DOCX sont recommandés</li>
              <li>• Nommez vos fichiers de manière descriptive</li>
              <li>• Organisez vos fichiers dans les bons dossiers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};