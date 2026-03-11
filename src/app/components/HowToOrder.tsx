import { Search, MessageCircle, Package } from 'lucide-react';

export function HowToOrder() {
  const steps = [
    {
      icon: Search,
      title: 'Choisissez un vêtement',
      description: 'Parcourez notre collection et trouvez l\'article parfait',
      color: 'bg-[#FF8B8B]/20 text-[#FF8B8B]',
    },
    {
      icon: MessageCircle,
      title: 'Cliquez "Commander sur WhatsApp"',
      description: 'Envoyez-nous un message direct avec le produit sélectionné',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Package,
      title: 'Confirmez taille & livraison',
      description: 'Nous confirmons la disponibilité et organisons la livraison',
      color: 'bg-[#6B9AC4]/20 text-[#6B9AC4]',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#FFB347]/10 via-[#87CCA8]/10 to-[#6B9AC4]/10 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment Commander ?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Simple, rapide et sécurisé. Commandez en 3 étapes faciles !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-[#FF8B8B] via-[#FFB347] to-[#87CCA8] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`${step.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="font-bold text-xl mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg
                    className="w-8 h-8 text-[#87CCA8]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-4 font-semibold">
            Prêt à commander ? C'est parti ! 🎉
          </p>
          <p className="text-sm text-gray-500">
            Notre équipe vous répond rapidement sur WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}