import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'audio' | 'video';
  isIncoming: boolean;
  participant: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  } | null;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  callType,
  isIncoming,
  participant,
  onAccept,
  onDecline
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  useEffect(() => {
    if (!isOpen) {
      setIsConnected(false);
      setDuration(0);
      setIsMuted(false);
      setIsVideoEnabled(callType === 'video');
      setIsSpeakerOn(false);
    }
  }, [isOpen, callType]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setIsConnected(true);
    onAccept?.();
  };

  const handleDecline = () => {
    onDecline?.();
    onClose();
  };

  const handleEndCall = () => {
    onClose();
  };

  if (!isOpen || !participant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold">{participant.avatar}</span>
            </div>
            <h3 className="text-xl font-semibold">{participant.name}</h3>
            <p className="text-blue-100 text-sm">
              {isIncoming ? (
                isConnected ? 'Appel en cours' : `Appel ${callType === 'video' ? 'vidéo' : 'audio'} entrant`
              ) : (
                isConnected ? 'Appel en cours' : 'Appel en cours...'
              )}
            </p>
            {isConnected && (
              <p className="text-blue-100 text-lg font-mono mt-2">
                {formatDuration(duration)}
              </p>
            )}
          </div>
        </div>

        {/* Video Area (for video calls) */}
        {callType === 'video' && isVideoEnabled && isConnected && (
          <div className="relative bg-gray-900 h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Vidéo simulée</p>
              </div>
            </div>
            
            {/* Self video (small overlay) */}
            <div className="absolute top-4 right-4 w-20 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-white text-xs">Vous</div>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="p-6">
          {isIncoming && !isConnected ? (
            /* Incoming call buttons */
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleDecline}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
              <button
                onClick={handleAccept}
                className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Phone className="h-6 w-6" />
              </button>
            </div>
          ) : (
            /* Active call controls */
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={isMuted ? 'Activer le micro' : 'Couper le micro'}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {callType === 'video' && (
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    !isVideoEnabled ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={isVideoEnabled ? 'Désactiver la vidéo' : 'Activer la vidéo'}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
              )}

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isSpeakerOn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={isSpeakerOn ? 'Désactiver le haut-parleur' : 'Activer le haut-parleur'}
              >
                {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>

              <button
                onClick={handleEndCall}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                title="Raccrocher"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Call Status */}
        {!isIncoming && !isConnected && (
          <div className="px-6 pb-6">
            <div className="text-center">
              <div className="flex justify-center space-x-1 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-600 text-sm">Connexion en cours...</p>
              
              {/* Simulate connection after 3 seconds */}
              {setTimeout(() => {
                if (isOpen && !isConnected) {
                  setIsConnected(true);
                }
              }, 3000)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};