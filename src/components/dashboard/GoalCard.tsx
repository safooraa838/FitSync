import React from 'react';
import { Goal } from '../../contexts/GoalsContext';
import { Target, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { formatDistance } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  className?: string;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, className = '' }) => {
  const timeLeft = formatDistance(new Date(goal.endDate), new Date(), { addSuffix: true });
  
  // Determine color based on category
  const getCategoryColor = (category: string): 'primary' | 'accent' | 'complementary' | 'warning' | 'success' => {
    switch (category) {
      case 'weight':
        return 'primary';
      case 'strength':
        return 'warning';
      case 'cardio':
        return 'complementary';
      case 'nutrition':
        return 'accent';
      case 'habit':
        return 'success';
      default:
        return 'primary';
    }
  };

  const color = getCategoryColor(goal.category);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    return <Target size={18} />;
  };

  return (
    <Card className={`p-4 ${className}`} hoverEffect>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center mb-1">
            <span className={`p-1.5 rounded-md mr-2 bg-${color}-50 text-${color}-600`}>
              {getCategoryIcon(goal.category)}
            </span>
            <h3 className="font-medium text-gray-900">{goal.title}</h3>
          </div>
          <p className="text-sm text-gray-500">{goal.description}</p>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{timeLeft}</span>
        </div>
      </div>

      <ProgressBar 
        value={goal.progress} 
        max={100} 
        color={color}
        label={`${goal.currentValue} / ${goal.target} ${goal.unit}`}
      />
    </Card>
  );
};

export default GoalCard;