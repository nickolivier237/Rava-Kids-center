import { X, MessageCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from './ProductCard';
import { useState, useEffect } from 'react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  whatsappNumber?: string;
}

export function ProductQuickView({ product, onClose, onAddToCart, whatsappNumber = '1234567890' }: ProductQuickViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Réinitialisation lors du changement de produit
  useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  // Logique des images
  const allImages = [
    product.image,
    ...(product.images || [])
  ].filter((img): img is string => Boolean(img) && img !== "");
  
  const uniqueImages = Array.from(new Set(allImages));
  const inStock = product.inStock !== false;

  const handleWhatsAppClick = () => {
    const message = `Bonjour, je suis intéressé(e) par "${product.name}" – ${product.price.toLocaleString('fr-FR')} FCFA (Quantité: ${quantity}). Est-il/elle disponible ?`;
    const encodedMessage = encodeURIComponent(message);
    // Correction du lien WhatsApp (ajout du /)
    window.open(`https://wa.me{whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50 animate-in fade-in" onClick={onClose} />

      {/* Modal - Utilisation de overflow-hidden pour contenir le scroll interne */}
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-lg shadow-2xl z-50 animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
        
        {/* Container principal - Hauteur calculée pour mobile pour forcer le scroll interne */}
        <div className="flex flex-col md:flex-row max-h-[calc(100vh-2rem)] md:max-h-[90vh]">
          
          {/* Image Gallery Section - Fixe en haut sur mobile */}
          <div className="h-64 md:h-auto md:w-1/2 bg-gray-100 relative shrink-0">
            <img
              src={uniqueImages[currentImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            
            {uniqueImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors z-10 shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors z-10 shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {uniqueImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <Badge className={`absolute top-4 left-4 ${inStock ? 'bg-[#87CCA8] text-white' : 'bg-red-500 text-white'}`}>
              {inStock ? '✓ Disponible' : '✗ Épuisé'}
            </Badge>
          </div>

          {/* Details Section - C'est ici que le scroll est géré */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Header (Fixe) */}
            <div className="flex items-start justify-between p-6 border-b shrink-0 bg-white">
              <div className="flex-1">
                <Badge className="mb-2 bg-[#FFB347] text-white">{product.ageRange}</Badge>
                <h2 className="text-xl md:text-2xl font-bold mb-1 leading-tight">{product.name}</h2>
                <p className="text-2xl font-bold text-[#6B9AC4]">{product.price.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0"><X className="w-5 h-5" /></Button>
            </div>

            {/* Zone de contenu (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Tailles Disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline" className="px-3 py-1 font-medium">{size}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Quantité</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1} className="h-10 w-10">-</Button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-10 w-10">+</Button>
                </div>
              </div>

              {uniqueImages.length > 1 && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-800">Images ({uniqueImages.length})</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {uniqueImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${index === currentImageIndex ? 'border-[#6B9AC4] ring-2 ring-[#6B9AC4]/30' : 'border-gray-200'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer d'action (Fixe) */}
            <div className="p-6 border-t bg-gray-50 shrink-0 space-y-2">
              {onAddToCart && (
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full bg-[#6B9AC4] hover:bg-[#5A89B3] text-white text-lg py-6 disabled:opacity-50"
                >
                  Ajouter au Panier ({quantity})
                </Button>
              )}
              <Button
                onClick={handleWhatsAppClick}
                disabled={!inStock}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6 disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {inStock ? 'Commander sur WhatsApp' : 'Produit Épuisé'}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
