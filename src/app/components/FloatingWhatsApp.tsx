import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export function FloatingWhatsApp({ whatsappNumber = '1234567890' }: FloatingWhatsAppProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    const message = 'Bonjour, j\'ai une question sur vos robes.';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isExpanded && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl p-4 w-64 mb-2 animate-in slide-in-from-bottom-4 fade-in">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Besoin d'aide ?</h3>
              <p className="text-xs text-gray-500">En ligne maintenant</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Posez vos questions sur nos robes, les tailles, la livraison...
          </p>
          <button
            onClick={handleClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
          >
            Démarrer la conversation
          </button>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
      
      {/* Notification Badge */}
      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
        1
      </div>
    </div>
  );
}
