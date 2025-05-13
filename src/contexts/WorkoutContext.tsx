import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockWorkouts } from '../data/mockData';

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  duration?: number; // in seconds
  distance?: number; // in meters
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  name: string;
  type: string;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  caloriesBurned: number;
  notes?: string;
}

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsByDateRange: (startDate: string, endDate: string) => Workout[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  
  useEffect(() => {
    if (user) {
      // Load user's workouts (from mock data for now)
      const userWorkouts = mockWorkouts.filter(
        (workout) => workout.userId === user.id
      );
      setWorkouts(userWorkouts);
      
      // In a real app, you would fetch from API here
    } else {
      setWorkouts([]);
    }
  }, [user]);
  
  const addWorkout = (workoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: `workout-${Date.now()}`,
    };
    
    setWorkouts((prev) => [...prev, newWorkout]);
    
    // In a real app, you would save to API here
  };
  
  const updateWorkout = (id: string, workoutData: Partial<Workout>) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === id ? { ...workout, ...workoutData } : workout
      )
    );
    
    // In a real app, you would update via API here
  };
  
  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    
    // In a real app, you would delete via API here
  };
  
  const getWorkoutsByDateRange = (startDate: string, endDate: string) => {
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate >= new Date(startDate) && workoutDate <= new Date(endDate)
      );
    });
  };
  
  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getWorkoutsByDateRange,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};