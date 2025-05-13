import React from 'react';
import { Dumbbell, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Workout } from '../../contexts/WorkoutContext';
import Card from '../ui/Card';

interface RecentWorkoutCardProps {
  workout: Workout;
  className?: string;
}

const RecentWorkoutCard: React.FC<RecentWorkoutCardProps> = ({
  workout,
  className = '',
}) => {
  return (
    <Card 
      className={`p-4 cursor-pointer ${className}`}
      hoverEffect
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className="p-1.5 bg-primary-50 rounded-md text-primary-600 mr-2">
              <Dumbbell size={18} />
            </span>
            <h3 className="font-medium text-gray-900">{workout.name}</h3>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(workout.date), 'EEEE, MMMM d')}
          </p>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          {workout.duration} min
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Exercises</p>
        <div className="space-y-1">
          {workout.exercises.slice(0, 3).map((exercise) => (
            <div key={exercise.id} className="flex justify-between text-sm">
              <span className="text-gray-800">{exercise.name}</span>
              <span className="text-gray-500">
                {exercise.sets} x {exercise.reps} {exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
              </span>
            </div>
          ))}
          
          {workout.exercises.length > 3 && (
            <p className="text-xs text-primary-600 font-medium mt-1">
              + {workout.exercises.length - 3} more exercises
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-sm flex justify-between items-center">
        <span className="text-gray-500">
          <span className="font-medium text-gray-900">{workout.caloriesBurned}</span> calories burned
        </span>
        
        <span className="text-primary-600 font-medium">View Details</span>
      </div>
    </Card>
  );
};

export default RecentWorkoutCard;