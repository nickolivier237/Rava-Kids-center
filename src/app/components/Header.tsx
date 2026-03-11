import { ShoppingCart, Menu, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import logoImage from '../../assets/Rava.jpg';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

export function Header({ cartCount, onCartClick, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="Rava Kids Center" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#FF8B8B] via-[#FFB347] via-[#87CCA8] to-[#6B9AC4] bg-clip-text text-transparent">
                  Rava Kids Center
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Mode Enfants 0-15 Ans
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Contactez-nous</span>
            </a>
            
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#FF8B8B] hover:bg-[#FF7676] min-w-[20px] h-5 flex items-center justify-center p-1">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}