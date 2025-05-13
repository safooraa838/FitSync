import React, { useState } from 'react';
import { useGoals, Goal } from '../contexts/GoalsContext';
import { Target, Plus, CalendarClock, X, ChevronDown, ChevronUp, Save, Trash2, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ProgressBar from '../components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistance } from 'date-fns';

const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, updateGoalProgress } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  
  // Form state
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    userId: 'user-1', // This would normally come from auth context
    title: '',
    description: '',
    category: 'weight',
    target: 0,
    unit: 'kg',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    currentValue: 0,
    progress: 0,
    isCompleted: false,
  });
  
  // Filtered goals based on filter
  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.isCompleted;
    if (filter === 'completed') return goal.isCompleted;
    return true;
  });
  
  // Submit new goal
  const handleSubmitGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    
    // Calculate initial progress
    const progress = Math.min(
      100,
      Math.round((newGoal.currentValue / newGoal.target) * 100)
    );
    
    const isCompleted = progress >= 100;
    
    const goalToAdd = {
      ...newGoal,
      progress,
      isCompleted,
    };
    
    addGoal(goalToAdd);
    
    // Reset form
    setNewGoal({
      userId: 'user-1',
      title: '',
      description: '',
      category: 'weight',
      target: 0,
      unit: 'kg',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      currentValue: 0,
      progress: 0,
      isCompleted: false,
    });
    
    setShowForm(false);
  };
  
  // Update goal progress
  const handleUpdateProgress = (goalId: string, newValue: number) => {
    updateGoalProgress(goalId, newValue);
  };
  
  // Get unit options based on category
  const getUnitOptions = (category: string) => {
    switch (category) {
      case 'weight':
        return [
          { value: 'kg', label: 'kg' },
          { value: 'lbs', label: 'lbs' },
        ];
      case 'strength':
        return [
          { value: 'kg', label: 'kg' },
          { value: 'lbs', label: 'lbs' },
          { value: 'reps', label: 'reps' },
        ];
      case 'cardio':
        return [
          { value: 'km', label: 'km' },
          { value: 'miles', label: 'miles' },
          { value: 'min', label: 'minutes' },
        ];
      case 'nutrition':
        return [
          { value: 'g', label: 'grams' },
          { value: 'cal', label: 'calories' },
          { value: '%', label: 'percent' },
        ];
      case 'habit':
        return [
          { value: 'days', label: 'days' },
          { value: 'times', label: 'times' },
          { value: 'hours', label: 'hours' },
        ];
      default:
        return [{ value: 'units', label: 'units' }];
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fitness Goals</h1>
          <p className="text-gray-500 mt-1">Track and achieve your fitness goals</p>
        </div>
        
        <Button 
          className="mt-4 sm:mt-0"
          iconLeft={<Plus size={16} />}
          onClick={() => setShowForm(true)}
        >
          Add Goal
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex space-x-2">
        <Button 
          variant={filter === 'active' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={filter === 'completed' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
        <Button 
          variant={filter === 'all' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>
      
      {/* New Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">New Goal</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  label="Goal Title"
                  placeholder="e.g., Lose 5kg of weight"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  fullWidth
                />
                
                <Select
                  label="Category"
                  options={[
                    { value: 'weight', label: 'Weight' },
                    { value: 'strength', label: 'Strength' },
                    { value: 'cardio', label: 'Cardio' },
                    { value: 'nutrition', label: 'Nutrition' },
                    { value: 'habit', label: 'Habit' },
                  ]}
                  value={newGoal.category}
                  onChange={(e) => {
                    const category = e.target.value;
                    // Update unit based on category
                    const defaultUnit = getUnitOptions(category)[0].value;
                    setNewGoal(prev => ({ 
                      ...prev, 
                      category: category as any,
                      unit: defaultUnit
                    }));
                  }}
                  fullWidth
                />
                
                <Input
                  label="Description (optional)"
                  placeholder="Add details about your goal"
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  fullWidth
                />
                
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="Target Value"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ 
                      ...prev, 
                      target: Number(e.target.value) 
                    }))}
                    fullWidth
                  />
                  
                  <Select
                    label="Unit"
                    options={getUnitOptions(newGoal.category)}
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ 
                      ...prev, 
                      unit: e.target.value 
                    }))}
                    fullWidth
                  />
                  
                  <Input
                    label="Current Value"
                    type="number"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal(prev => ({ 
                      ...prev, 
                      currentValue: Number(e.target.value) 
                    }))}
                    fullWidth
                  />
                </div>
                
                <Input
                  label="Start Date"
                  type="date"
                  value={new Date(newGoal.startDate).toISOString().split('T')[0]}
                  onChange={(e) => setNewGoal(prev => ({ 
                    ...prev, 
                    startDate: new Date(e.target.value).toISOString() 
                  }))}
                  fullWidth
                />
                
                <Input
                  label="Target Date"
                  type="date"
                  value={new Date(newGoal.endDate).toISOString().split('T')[0]}
                  onChange={(e) => setNewGoal(prev => ({ 
                    ...prev, 
                    endDate: new Date(e.target.value).toISOString() 
                  }))}
                  fullWidth
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  iconLeft={<Save size={16} />}
                  onClick={handleSubmitGoal}
                  disabled={!newGoal.title || !newGoal.target}
                >
                  Save Goal
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onDelete={deleteGoal}
              onUpdateProgress={handleUpdateProgress}
            />
          ))
        ) : (
          <Card className="p-6 text-center">
            <Target size={32} className="mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {filter === 'active' 
                ? "No active goals" 
                : filter === 'completed' 
                  ? "No completed goals" 
                  : "No goals found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'active' 
                ? "Set goals to stay motivated on your fitness journey" 
                : filter === 'completed' 
                  ? "Complete your goals to see them here" 
                  : "Start by creating your first fitness goal"}
            </p>
            {filter !== 'completed' && (
              <Button onClick={() => setShowForm(true)}>
                Create Your First Goal
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

// Goal Card Component
const GoalCard: React.FC<{ 
  goal: Goal; 
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, newValue: number) => void;
}> = ({ goal, onDelete, onUpdateProgress }) => {
  const [expanded, setExpanded] = useState(false);
  const [newValue, setNewValue] = useState(goal.currentValue);
  
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
  const timeLeft = !goal.isCompleted ? formatDistance(new Date(goal.endDate), new Date(), { addSuffix: true }) : '';
  
  // Submit updated progress
  const submitProgress = () => {
    onUpdateProgress(goal.id, newValue);
  };
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className={`p-1.5 rounded-md mr-2 bg-${color}-50 text-${color}-600`}>
                <Target size={18} />
              </div>
              <h3 className="font-medium text-gray-900">{goal.title}</h3>
              {goal.isCompleted && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
                  <Check size={12} className="mr-1" />
                  Completed
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mt-1">
              {goal.description || `Target: ${goal.target} ${goal.unit}`}
            </p>
          </div>
          
          <div className="flex items-center">
            {!goal.isCompleted && (
              <div className="text-xs text-gray-500 flex items-center mr-3">
                <CalendarClock size={12} className="mr-1" />
                {timeLeft}
              </div>
            )}
            
            <button 
              className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
        
        <div className="mt-3">
          <ProgressBar 
            value={goal.progress} 
            color={color}
            label={`${goal.currentValue} / ${goal.target} ${goal.unit}`}
          />
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-gray-100 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="text-sm">
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium">{format(new Date(goal.startDate), 'MMMM d, yyyy')}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Target Date</p>
                  <p className="font-medium">{format(new Date(goal.endDate), 'MMMM d, yyyy')}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium capitalize">{goal.category}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Progress</p>
                  <p className="font-medium">{goal.progress}%</p>
                </div>
              </div>
              
              {!goal.isCompleted && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Update Progress</h4>
                  <div className="flex items-end space-x-2">
                    <Input
                      label="Current Value"
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="mb-2 text-gray-500">{goal.unit}</span>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        submitProgress();
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  iconLeft={<Trash2 size={14} />}
                  className="text-danger-600 hover:bg-danger-50 hover:border-danger-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(goal.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default GoalsPage;