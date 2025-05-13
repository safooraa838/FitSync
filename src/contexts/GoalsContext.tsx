import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockGoals } from '../data/mockData';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'weight' | 'strength' | 'cardio' | 'nutrition' | 'habit';
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
  currentValue: number;
  progress: number; // 0-100 percentage
  isCompleted: boolean;
}

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, currentValue: number) => void;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  
  useEffect(() => {
    if (user) {
      // Load user's goals (from mock data for now)
      const userGoals = mockGoals.filter((goal) => goal.userId === user.id);
      setGoals(userGoals);
      
      // In a real app, you would fetch from API here
    } else {
      setGoals([]);
    }
  }, [user]);
  
  const addGoal = (goalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
    };
    
    setGoals((prev) => [...prev, newGoal]);
    
    // In a real app, you would save to API here
  };
  
  const updateGoal = (id: string, goalData: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...goalData } : goal))
    );
    
    // In a real app, you would update via API here
  };
  
  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    
    // In a real app, you would delete via API here
  };
  
  const updateGoalProgress = (id: string, currentValue: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === id) {
          const progress = Math.min(
            100,
            Math.round((currentValue / goal.target) * 100)
          );
          const isCompleted = progress >= 100;
          
          return {
            ...goal,
            currentValue,
            progress,
            isCompleted,
          };
        }
        return goal;
      })
    );
    
    // In a real app, you would update via API here
  };
  
  const getActiveGoals = () => {
    return goals.filter((goal) => !goal.isCompleted);
  };
  
  const getCompletedGoals = () => {
    return goals.filter((goal) => goal.isCompleted);
  };
  
  return (
    <GoalsContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        updateGoalProgress,
        getActiveGoals,
        getCompletedGoals,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};