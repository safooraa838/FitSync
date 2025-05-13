import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockMeals } from '../data/mockData';

export interface NutritionItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  servingSize: number; // in grams
  servings: number;
}

export interface Meal {
  id: string;
  userId: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: NutritionItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  notes?: string;
}

interface NutritionContextType {
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  getMealsByDate: (date: string) => Meal[];
  getMealsByDateRange: (startDate: string, endDate: string) => Meal[];
  getDailyNutritionTotals: (date: string) => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  
  useEffect(() => {
    if (user) {
      // Load user's meals (from mock data for now)
      const userMeals = mockMeals.filter((meal) => meal.userId === user.id);
      setMeals(userMeals);
      
      // In a real app, you would fetch from API here
    } else {
      setMeals([]);
    }
  }, [user]);
  
  const addMeal = (mealData: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...mealData,
      id: `meal-${Date.now()}`,
    };
    
    setMeals((prev) => [...prev, newMeal]);
    
    // In a real app, you would save to API here
  };
  
  const updateMeal = (id: string, mealData: Partial<Meal>) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === id ? { ...meal, ...mealData } : meal))
    );
    
    // In a real app, you would update via API here
  };
  
  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
    
    // In a real app, you would delete via API here
  };
  
  const getMealsByDate = (date: string) => {
    return meals.filter((meal) => {
      const mealDate = new Date(meal.date).toISOString().split('T')[0];
      return mealDate === new Date(date).toISOString().split('T')[0];
    });
  };
  
  const getMealsByDateRange = (startDate: string, endDate: string) => {
    return meals.filter((meal) => {
      const mealDate = new Date(meal.date);
      return (
        mealDate >= new Date(startDate) && mealDate <= new Date(endDate)
      );
    });
  };
  
  const getDailyNutritionTotals = (date: string) => {
    const dailyMeals = getMealsByDate(date);
    
    return dailyMeals.reduce(
      (acc, meal) => {
        return {
          calories: acc.calories + meal.totalCalories,
          protein: acc.protein + meal.totalProtein,
          carbs: acc.carbs + meal.totalCarbs,
          fat: acc.fat + meal.totalFat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };
  
  return (
    <NutritionContext.Provider
      value={{
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        getMealsByDate,
        getMealsByDateRange,
        getDailyNutritionTotals,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = (): NutritionContextType => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};