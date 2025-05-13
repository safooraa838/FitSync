import React from 'react';
import { Pizza } from 'lucide-react';
import { format } from 'date-fns';
import { Meal } from '../../contexts/NutritionContext';
import Card from '../ui/Card';

interface MealCardProps {
  meal: Meal;
  className?: string;
}

const MealCard: React.FC<MealCardProps> = ({ meal, className = '' }) => {
  // Function to capitalize first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Card className={`p-4 cursor-pointer ${className}`} hoverEffect>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className="p-1.5 bg-complementary-50 rounded-md text-complementary-600 mr-2">
              <Pizza size={18} />
            </span>
            <h3 className="font-medium text-gray-900">{capitalize(meal.type)}</h3>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(meal.date), 'h:mm a')}
          </p>
        </div>

        <div className="text-sm font-medium text-gray-900">
          {meal.totalCalories} cal
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Foods</p>
        <div className="space-y-1">
          {meal.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-800">{item.name}</span>
              <span className="text-gray-500">
                {item.calories} cal ({item.servings > 1 ? `${item.servings}x ` : ''}
                {item.servingSize}g)
              </span>
            </div>
          ))}

          {meal.items.length > 3 && (
            <p className="text-xs text-complementary-600 font-medium mt-1">
              + {meal.items.length - 3} more items
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-primary-50 p-1.5 rounded text-center">
          <p className="text-gray-500">Protein</p>
          <p className="font-medium text-gray-900">{meal.totalProtein}g</p>
        </div>
        <div className="bg-accent-50 p-1.5 rounded text-center">
          <p className="text-gray-500">Carbs</p>
          <p className="font-medium text-gray-900">{meal.totalCarbs}g</p>
        </div>
        <div className="bg-complementary-50 p-1.5 rounded text-center">
          <p className="text-gray-500">Fat</p>
          <p className="font-medium text-gray-900">{meal.totalFat}g</p>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;