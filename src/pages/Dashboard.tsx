import React from 'react';
import { Dumbbell, Pizza, Flame, LineChart, Trophy, TrendingUp, Scale } from 'lucide-react';
import { format } from 'date-fns';
import { useWorkouts } from '../contexts/WorkoutContext';
import { useNutrition } from '../contexts/NutritionContext';
import { useGoals } from '../contexts/GoalsContext';
import { useAuth } from '../contexts/AuthContext';
import { mockHealthMetrics, mockWearableData } from '../data/mockData';

// Components
import StatCard from '../components/dashboard/StatCard';
import RecentWorkoutCard from '../components/dashboard/RecentWorkoutCard';
import MealCard from '../components/dashboard/MealCard';
import GoalCard from '../components/dashboard/GoalCard';
import Card from '../components/ui/Card';
import MacroDistributionChart from '../components/charts/MacroDistributionChart';
import WeightProgressChart from '../components/charts/WeightProgressChart';
import CalorieBalanceChart from '../components/charts/CalorieBalanceChart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { workouts } = useWorkouts();
  const { meals } = useNutrition();
  const { goals } = useGoals();
  
  // Get today's date in ISO format
  const today = new Date().toISOString().split('T')[0];
  
  // Recent workouts
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // Today's meals
  const todaysMeals = meals.filter(
    (meal) => new Date(meal.date).toISOString().split('T')[0] === today
  );
  
  // Active goals
  const activeGoals = goals.filter((goal) => !goal.isCompleted).slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        
        {user && (
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="mr-3 text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back,</p>
              <p className="text-base font-semibold text-primary-600">{user.name}</p>
            </div>
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-lg border-2 border-white shadow-sm">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Daily Steps"
          value={mockWearableData.dailySteps[mockWearableData.dailySteps.length - 1].value.toLocaleString()}
          icon={<TrendingUp size={24} />}
          color="primary"
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Calories Burned"
          value={mockHealthMetrics.caloriesBurned[mockHealthMetrics.caloriesBurned.length - 1].value.toLocaleString()}
          icon={<Flame size={24} />}
          color="complementary"
          change={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Workouts This Week"
          value={workouts.filter(w => {
            const workoutDate = new Date(w.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return workoutDate >= weekAgo;
          }).length}
          icon={<Dumbbell size={24} />}
          color="accent"
        />
        <StatCard
          title="Weight"
          value={`${mockHealthMetrics.weight[mockHealthMetrics.weight.length - 1].value} kg`}
          icon={<Scale size={24} />}
          color="warning"
          change={{ value: 2.5, isPositive: true }}
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-2">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <WeightProgressChart data={mockHealthMetrics.weight} />
            </Card>
            
            <Card className="p-4">
              <CalorieBalanceChart 
                caloriesConsumed={mockHealthMetrics.caloriesConsumed}
                caloriesBurned={mockHealthMetrics.caloriesBurned}
              />
            </Card>
          </div>
          
          {/* Recent Workouts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
              <a href="/workout" className="text-primary-600 text-sm font-medium hover:underline">
                View All
              </a>
            </div>
            
            {recentWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentWorkouts.map((workout) => (
                  <RecentWorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Dumbbell size={32} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No workouts yet</h3>
                <p className="text-gray-500 mb-4">Start logging your fitness activities</p>
                <a 
                  href="/workout" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Workout
                </a>
              </Card>
            )}
          </div>
          
          {/* Today's Nutrition */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Nutrition</h2>
              <a href="/nutrition" className="text-primary-600 text-sm font-medium hover:underline">
                View All
              </a>
            </div>
            
            {todaysMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {todaysMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Pizza size={32} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No meals logged today</h3>
                <p className="text-gray-500 mb-4">Track your nutrition to reach your goals</p>
                <a 
                  href="/nutrition" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Log a Meal
                </a>
              </Card>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* User's Active Goals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Active Goals</h2>
              <a href="/goals" className="text-primary-600 text-sm font-medium hover:underline">
                View All
              </a>
            </div>
            
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                {activeGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Trophy size={32} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No active goals</h3>
                <p className="text-gray-500 mb-4">Set fitness goals to stay motivated</p>
                <a 
                  href="/goals" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add a Goal
                </a>
              </Card>
            )}
          </div>
          
          {/* Macro Distribution */}
          <Card className="p-4">
            <MacroDistributionChart data={mockHealthMetrics.macroDistribution} />
          </Card>
          
          {/* Activity Summary */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Activity Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-sm text-gray-600">Daily Steps</span>
                </div>
                <span className="font-medium">{mockWearableData.dailySteps[mockWearableData.dailySteps.length - 1].value.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-complementary-100 flex items-center justify-center text-complementary-600 mr-3">
                    <Flame size={16} />
                  </div>
                  <span className="text-sm text-gray-600">Calories Burned</span>
                </div>
                <span className="font-medium">{mockHealthMetrics.caloriesBurned[mockHealthMetrics.caloriesBurned.length - 1].value.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-3">
                    <Pizza size={16} />
                  </div>
                  <span className="text-sm text-gray-600">Calories Consumed</span>
                </div>
                <span className="font-medium">{mockHealthMetrics.caloriesConsumed[mockHealthMetrics.caloriesConsumed.length - 1].value.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 mr-3">
                    <LineChart size={16} />
                  </div>
                  <span className="text-sm text-gray-600">Avg. Heart Rate</span>
                </div>
                <span className="font-medium">{mockWearableData.heartRate.average} bpm</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;