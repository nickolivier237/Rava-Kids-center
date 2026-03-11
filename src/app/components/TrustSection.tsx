import { MapPin, Truck, CreditCard, ShieldCheck, Clock, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function TrustSection() {
  return (
    <div className="bg-white py-12 border-y">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Pourquoi Commander Chez Nous ?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Location */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-[#FFB347]/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#FFB347]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Localisation</h3>
              <p className="text-gray-600">
                📍 Douala & Yaoundé<br />
                Entreprise locale de confiance
              </p>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-[#6B9AC4]/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-[#6B9AC4]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">
                🚚 Toutes les villes du Cameroun<br />
                Livraison en 2-5 jours
              </p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-[#87CCA8]/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-[#87CCA8]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Paiement Flexible</h3>
              <p className="text-gray-600">
                💰 Mobile Money (MTN, Orange)<br />
                💵 Paiement à la livraison
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Trust Elements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-[#FF8B8B] mb-2">
              <ShieldCheck className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm font-semibold">100% Sécurisé</p>
          </div>
          
          <div className="text-center">
            <div className="text-[#FFB347] mb-2">
              <Clock className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm font-semibold">Réponse Rapide</p>
          </div>
          
          <div className="text-center">
            <div className="text-[#87CCA8] mb-2">
              <Star className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm font-semibold">Photos Réelles</p>
          </div>
          
          <div className="text-center">
            <div className="text-[#6B9AC4] mb-2">
              <Truck className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm font-semibold">Retour Gratuit</p>
          </div>
        </div>
      </div>
    </div>
  );
}