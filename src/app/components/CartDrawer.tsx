import { X, Trash2, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Product } from './ProductCard';

interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
}: CartDrawerProps) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    // Create WhatsApp message
    let message = '🛍️ *Nouvelle Commande*\\n\\n';
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\\n`;
      message += `   • Quantité: ${item.quantity}\\n`;
      message += `   • Prix: ${item.price.toLocaleString('fr-FR')} FCFA\\n`;
      message += `   • Âge: ${item.ageRange}\\n\\n`;
    });
    message += `💰 *Total: ${total.toLocaleString('fr-FR')} FCFA*\\n\\n`;
    message += 'Veuillez confirmer la disponibilité et les détails de livraison.';

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp business number
    const whatsappNumber = '237680246823';
    
    // Open WhatsApp
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      '_blank'
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Panier</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="text-6xl mb-4">🛒</div>
                <p>Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 rounded-lg p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">{item.ageRange}</p>
                      <p className="text-pink-600 font-bold mt-1">
                        {item.price.toLocaleString('fr-FR')} FCFA
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="text-sm font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-pink-600">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Commander via WhatsApp
              </Button>
              <p className="text-xs text-center text-gray-500">
                Vous serez redirigé vers WhatsApp pour finaliser votre commande
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}