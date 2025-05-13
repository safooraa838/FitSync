import React, { useState } from 'react';
import { useWorkouts, Workout, WorkoutExercise } from '../contexts/WorkoutContext';
import { Dumbbell, Plus, Search, Calendar, X, ChevronDown, ChevronUp, Save, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { exerciseLibrary } from '../data/mockData';

const WorkoutTracker: React.FC = () => {
  const { workouts, addWorkout, deleteWorkout } = useWorkouts();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, 'id'>>({
    userId: 'user-1', // This would normally come from auth context
    date: new Date().toISOString(),
    name: '',
    type: 'strength',
    duration: 0,
    caloriesBurned: 0,
    exercises: [],
  });
  
  // State for exercise being added
  const [currentExercise, setCurrentExercise] = useState<Partial<WorkoutExercise>>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
  });
  
  // Filtered workouts based on search
  const filteredWorkouts = workouts
    .filter(workout => 
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Add exercise to new workout
  const addExerciseToWorkout = () => {
    if (!currentExercise.name) return;
    
    const newExercise: WorkoutExercise = {
      id: `exercise-${Date.now()}`,
      name: currentExercise.name!,
      sets: currentExercise.sets || 3,
      reps: currentExercise.reps || 10,
      weight: currentExercise.weight || 0,
      duration: currentExercise.duration,
      distance: currentExercise.distance,
    };
    
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
    
    // Reset current exercise
    setCurrentExercise({
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
    });
  };
  
  // Remove exercise from new workout
  const removeExercise = (exerciseId: string) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
    }));
  };
  
  // Submit new workout
  const handleSubmitWorkout = () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) return;
    
    addWorkout(newWorkout);
    
    // Reset form
    setNewWorkout({
      userId: 'user-1',
      date: new Date().toISOString(),
      name: '',
      type: 'strength',
      duration: 0,
      caloriesBurned: 0,
      exercises: [],
    });
    
    setShowForm(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workout Tracker</h1>
          <p className="text-gray-500 mt-1">Log and monitor your workouts</p>
        </div>
        
        <Button 
          className="mt-4 sm:mt-0"
          iconLeft={<Plus size={16} />}
          onClick={() => setShowForm(true)}
        >
          Add Workout
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={18} />}
          fullWidth
          className="sm:max-w-md"
        />
      </div>
      
      {/* New Workout Form */}
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
                <h2 className="text-lg font-semibold">New Workout</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  label="Workout Name"
                  placeholder="e.g., Morning Strength Training"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth
                />
                
                <Select
                  label="Workout Type"
                  options={[
                    { value: 'strength', label: 'Strength' },
                    { value: 'cardio', label: 'Cardio' },
                    { value: 'hiit', label: 'HIIT' },
                    { value: 'flexibility', label: 'Flexibility' },
                    { value: 'sports', label: 'Sports' },
                  ]}
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, type: e.target.value }))}
                  fullWidth
                />
                
                <Input
                  label="Date"
                  type="date"
                  value={new Date(newWorkout.date).toISOString().split('T')[0]}
                  onChange={(e) => setNewWorkout(prev => ({ 
                    ...prev, 
                    date: new Date(e.target.value).toISOString() 
                  }))}
                  fullWidth
                />
                
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout(prev => ({ 
                    ...prev, 
                    duration: Number(e.target.value) 
                  }))}
                  fullWidth
                />
                
                <Input
                  label="Calories Burned"
                  type="number"
                  value={newWorkout.caloriesBurned}
                  onChange={(e) => setNewWorkout(prev => ({ 
                    ...prev, 
                    caloriesBurned: Number(e.target.value) 
                  }))}
                  fullWidth
                />
              </div>
              
              {/* Add exercises */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Exercises</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Select
                      label="Exercise"
                      options={[
                        { value: '', label: 'Select Exercise' },
                        ...exerciseLibrary.map(ex => ({ 
                          value: ex.name, 
                          label: ex.name 
                        }))
                      ]}
                      value={currentExercise.name}
                      onChange={(e) => setCurrentExercise(prev => ({ 
                        ...prev, 
                        name: e.target.value 
                      }))}
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Sets"
                      type="number"
                      value={currentExercise.sets}
                      onChange={(e) => setCurrentExercise(prev => ({ 
                        ...prev, 
                        sets: Number(e.target.value) 
                      }))}
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Reps"
                      type="number"
                      value={currentExercise.reps}
                      onChange={(e) => setCurrentExercise(prev => ({ 
                        ...prev, 
                        reps: Number(e.target.value) 
                      }))}
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Weight (kg)"
                      type="number"
                      value={currentExercise.weight}
                      onChange={(e) => setCurrentExercise(prev => ({ 
                        ...prev, 
                        weight: Number(e.target.value) 
                      }))}
                      fullWidth
                    />
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  iconLeft={<Plus size={16} />}
                  onClick={addExerciseToWorkout}
                  disabled={!currentExercise.name}
                >
                  Add Exercise
                </Button>
              </div>
              
              {/* Exercise List */}
              {newWorkout.exercises.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Exercise List</h3>
                  
                  <div className="space-y-2">
                    {newWorkout.exercises.map((exercise, index) => (
                      <div 
                        key={exercise.id} 
                        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {exercise.sets} sets × {exercise.reps} reps {exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => removeExercise(exercise.id)}
                          className="text-gray-400 hover:text-danger-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                  onClick={handleSubmitWorkout}
                  disabled={!newWorkout.name || newWorkout.exercises.length === 0}
                >
                  Save Workout
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Workouts List */}
      <div className="space-y-4">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} onDelete={deleteWorkout} />
          ))
        ) : (
          <Card className="p-6 text-center">
            <Dumbbell size={32} className="mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No workouts found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Try adjusting your search" 
                : "Start tracking your workouts"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)}>
                Add Your First Workout
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

// Workout Card Component
const WorkoutCard: React.FC<{ 
  workout: Workout; 
  onDelete: (id: string) => void;
}> = ({ workout, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className="p-1.5 bg-primary-50 rounded-md text-primary-600 mr-2">
                <Dumbbell size={18} />
              </div>
              <h3 className="font-medium text-gray-900">{workout.name}</h3>
            </div>
            
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              {format(new Date(workout.date), 'EEEE, MMMM d, yyyy')}
              <span className="mx-2">•</span>
              <span>{workout.duration} min</span>
              <span className="mx-2">•</span>
              <span>{workout.caloriesBurned} calories</span>
            </div>
          </div>
          
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
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-gray-100 pt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises</h4>
              
              <div className="space-y-2 mb-4">
                {workout.exercises.map((exercise) => (
                  <div 
                    key={exercise.id} 
                    className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {exercise.sets} sets × {exercise.reps} reps {exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  iconLeft={<Trash2 size={14} />}
                  className="text-danger-600 hover:bg-danger-50 hover:border-danger-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(workout.id);
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

export default WorkoutTracker;