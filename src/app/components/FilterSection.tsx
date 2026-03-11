import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowUpDown } from 'lucide-react';

interface FilterSectionProps {
  selectedCategory: string;
  selectedAgeRange: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onAgeRangeChange: (ageRange: string) => void;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: 'price-asc', label: 'Prix Croissant' },
  { value: 'price-desc', label: 'Prix Décroissant' },
];

const ageRanges = ['Tous', '0-3 ans', '3-7 ans', '7-12 ans', '12-15 ans'];
const categories = ['Tous', 'Robes', 'T-Shirts', 'Pantalons', 'Ensembles', 'Chaussures', 'Sacs', 'Accessoires'];

export function FilterSection({
  selectedCategory,
  selectedAgeRange,
  sortBy,
  onCategoryChange,
  onAgeRangeChange,
  onSortChange,
}: FilterSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Trier par Prix
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange(option.value)}
                className={
                  sortBy === option.value
                    ? 'bg-[#6B9AC4] hover:bg-[#5A89B3] text-white'
                    : ''
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Age Range Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Tranche d'âge</h3>
          <div className="flex flex-wrap gap-2">
            {ageRanges.map((range) => (
              <Button
                key={range}
                variant={selectedAgeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => onAgeRangeChange(range)}
                className={
                  selectedAgeRange === range
                    ? 'bg-[#FFB347] hover:bg-[#FFA030] text-white'
                    : ''
                }
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Catégorie</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer px-3 py-1.5 ${
                  selectedCategory === category
                    ? 'bg-[#FF8B8B] hover:bg-[#FF7676] text-white'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}