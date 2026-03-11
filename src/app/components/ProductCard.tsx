import { Heart, MessageCircle, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[]; // Multiple images for gallery
  ageRange: string;
  category: string;
  description: string;
  sizes: string[];
  colors?: string[];
  inStock?: boolean;
  occasion?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  whatsappNumber?: string;
}

export function ProductCard({ product, onAddToCart, onQuickView, whatsappNumber = '1234567890' }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleWhatsAppClick = () => {
    const message = `Bonjour, je suis intéressé(e) par "${product.name}" – ${product.price.toLocaleString('fr-FR')} FCFA. Est-il/elle disponible ?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const inStock = product.inStock !== false; // Default to true if not specified

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          onClick={() => onQuickView(product)}
        />
        
        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <div className="bg-white rounded-full p-3">
            <Eye className="w-6 h-6 text-[#6B9AC4]" />
          </div>
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors z-10"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-[#FF8B8B] text-[#FF8B8B]' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Age Range Badge */}
        <Badge className="absolute top-3 left-3 bg-[#FFB347] hover:bg-[#FFA030] text-white">
          {product.ageRange}
        </Badge>

        {/* Stock Status Badge */}
        <Badge 
          className={`absolute bottom-3 left-3 ${
            inStock 
              ? 'bg-[#87CCA8] hover:bg-[#70B892] text-white' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {inStock ? '✓ Disponible' : '✗ Épuisé'}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>
        
        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-[#6B9AC4]">
              {product.price.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Tailles: {product.sizes.join(', ')}</span>
          </div>
        </div>
        
        {/* WhatsApp Button - Most Important */}
        <Button
          onClick={handleWhatsAppClick}
          disabled={!inStock}
          className="w-full bg-green-500 hover:bg-green-600 text-white mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {inStock ? 'Commander sur WhatsApp' : 'Épuisé'}
        </Button>

        {/* Quick View Button */}
        <Button
          variant="outline"
          onClick={() => onQuickView(product)}
          className="w-full border-[#6B9AC4] text-[#6B9AC4] hover:bg-[#6B9AC4] hover:text-white"
        >
          <Eye className="w-4 h-4 mr-2" />
          Voir détails
        </Button>
      </CardContent>
    </Card>
  );
}