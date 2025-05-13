import React, { useState } from 'react';
import { useNutrition, Meal, NutritionItem } from '../contexts/NutritionContext';
import { Pizza, Plus, Search, Calendar, X, ChevronDown, ChevronUp, Save, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { foodDatabase } from '../data/mockData';

const NutritionTracker: React.FC = () => {
  const { meals, addMeal, deleteMeal, getDailyNutritionTotals } = useNutrition();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Form state
  const [newMeal, setNewMeal] = useState<Omit<Meal, 'id'>>({
    userId: 'user-1', // This would normally come from auth context
    date: new Date().toISOString(),
    type: 'breakfast',
    items: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  });
  
  // State for food item being added
  const [currentItem, setCurrentItem] = useState<Partial<NutritionItem>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 100,
    servings: 1,
  });
  
  // Filtered meals based on search and date
  const filteredMeals = meals
    .filter(meal => {
      const mealDate = new Date(meal.date).toISOString().split('T')[0];
      const matchesDate = mealDate === selectedDate;
      
      if (!searchTerm) return matchesDate;
      
      const matchesSearch = 
        meal.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by meal type in a specific order
      const typeOrder = {
        breakfast: 1,
        lunch: 2,
        dinner: 3,
        snack: 4,
      };
      
      return typeOrder[a.type] - typeOrder[b.type];
    });
  
  // Calculate daily nutrition totals
  const dailyTotals = getDailyNutritionTotals(selectedDate);
  
  // Update current item when food is selected
  const handleFoodSelect = (foodName: string) => {
    if (!foodName) {
      setCurrentItem({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        servingSize: 100,
        servings: 1,
      });
      return;
    }
    
    const selectedFood = foodDatabase.find(food => food.name === foodName);
    
    if (selectedFood) {
      setCurrentItem({
        name: selectedFood.name,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat,
        servingSize: selectedFood.servingSize,
        servings: 1,
      });
    }
  };
  
  // Add food item to new meal
  const addFoodToMeal = () => {
    if (!currentItem.name) return;
    
    const servings = currentItem.servings || 1;
    
    const newItem: NutritionItem = {
      id: `food-${Date.now()}`,
      name: currentItem.name!,
      calories: currentItem.calories! * servings,
      protein: currentItem.protein! * servings,
      carbs: currentItem.carbs! * servings,
      fat: currentItem.fat! * servings,
      servingSize: currentItem.servingSize!,
      servings: servings,
    };
    
    // Update meal totals
    const updatedMeal = {
      ...newMeal,
      items: [...newMeal.items, newItem],
      totalCalories: newMeal.totalCalories + newItem.calories,
      totalProtein: newMeal.totalProtein + newItem.protein,
      totalCarbs: newMeal.totalCarbs + newItem.carbs,
      totalFat: newMeal.totalFat + newItem.fat,
    };
    
    setNewMeal(updatedMeal);
    
    // Reset current item
    setCurrentItem({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      servingSize: 100,
      servings: 1,
    });
  };
  
  // Remove food item from new meal
  const removeFoodItem = (itemId: string) => {
    const itemToRemove = newMeal.items.find(item => item.id === itemId);
    
    if (!itemToRemove) return;
    
    setNewMeal(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      totalCalories: prev.totalCalories - itemToRemove.calories,
      totalProtein: prev.totalProtein - itemToRemove.protein,
      totalCarbs: prev.totalCarbs - itemToRemove.carbs,
      totalFat: prev.totalFat - itemToRemove.fat,
    }));
  };
  
  // Submit new meal
  const handleSubmitMeal = () => {
    if (newMeal.items.length === 0) return;
    
    addMeal(newMeal);
    
    // Reset form
    setNewMeal({
      userId: 'user-1',
      date: new Date().toISOString(),
      type: 'breakfast',
      items: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    });
    
    setShowForm(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h1>
          <p className="text-gray-500 mt-1">Log and monitor your daily nutrition</p>
        </div>
        
        <Button 
          className="mt-4 sm:mt-0"
          iconLeft={<Plus size={16} />}
          onClick={() => setShowForm(true)}
        >
          Log Meal
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="sm:w-48"
        />
        
        <Input
          placeholder="Search meals or foods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={18} />}
          fullWidth
          className="sm:max-w-md"
        />
      </div>
      
      {/* Daily Nutrition Summary */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Daily Nutrition Summary</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Calories</div>
            <div className="text-2xl font-semibold">{dailyTotals.calories}</div>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Protein</div>
            <div className="text-2xl font-semibold">{dailyTotals.protein}g</div>
          </div>
          <div className="p-4 bg-accent-50 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Carbs</div>
            <div className="text-2xl font-semibold">{dailyTotals.carbs}g</div>
          </div>
          <div className="p-4 bg-complementary-50 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Fat</div>
            <div className="text-2xl font-semibold">{dailyTotals.fat}g</div>
          </div>
        </div>
      </Card>
      
      {/* New Meal Form */}
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
                <h2 className="text-lg font-semibold">Log a Meal</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Select
                  label="Meal Type"
                  options={[
                    { value: 'breakfast', label: 'Breakfast' },
                    { value: 'lunch', label: 'Lunch' },
                    { value: 'dinner', label: 'Dinner' },
                    { value: 'snack', label: 'Snack' },
                  ]}
                  value={newMeal.type}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, type: e.target.value as any }))}
                  fullWidth
                />
                
                <Input
                  label="Date"
                  type="date"
                  value={new Date(newMeal.date).toISOString().split('T')[0]}
                  onChange={(e) => setNewMeal(prev => ({ 
                    ...prev, 
                    date: new Date(e.target.value).toISOString() 
                  }))}
                  fullWidth
                />
                
                <Input
                  label="Time"
                  type="time"
                  value={new Date(newMeal.date).toTimeString().substring(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(newMeal.date);
                    newDate.setHours(hours, minutes);
                    setNewMeal(prev => ({
                      ...prev,
                      date: newDate.toISOString(),
                    }));
                  }}
                  fullWidth
                />
                
                <Input
                  label="Notes (optional)"
                  placeholder="Any additional notes about this meal"
                  value={newMeal.notes || ''}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, notes: e.target.value }))}
                  fullWidth
                />
              </div>
              
              {/* Add food items */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Add Foods</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                  <div className="md:col-span-3">
                    <Select
                      label="Food"
                      options={[
                        { value: '', label: 'Select Food' },
                        ...foodDatabase.map(food => ({ 
                          value: food.name, 
                          label: food.name 
                        }))
                      ]}
                      value={currentItem.name || ''}
                      onChange={(e) => handleFoodSelect(e.target.value)}
                      fullWidth
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Serving Size"
                      value={`${currentItem.servingSize || 100}g`}
                      disabled
                      fullWidth
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <Input
                      label="Servings"
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={currentItem.servings || 1}
                      onChange={(e) => setCurrentItem(prev => ({ 
                        ...prev, 
                        servings: Number(e.target.value) 
                      }))}
                      fullWidth
                    />
                  </div>
                </div>
                
                {currentItem.name && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm">
                      <span className="text-gray-500">Calories: </span>
                      <span className="font-medium">
                        {Math.round((currentItem.calories || 0) * (currentItem.servings || 1))}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Protein: </span>
                      <span className="font-medium">
                        {Math.round((currentItem.protein || 0) * (currentItem.servings || 1))}g
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Carbs: </span>
                      <span className="font-medium">
                        {Math.round((currentItem.carbs || 0) * (currentItem.servings || 1))}g
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Fat: </span>
                      <span className="font-medium">
                        {Math.round((currentItem.fat || 0) * (currentItem.servings || 1))}g
                      </span>
                    </div>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  iconLeft={<Plus size={16} />}
                  onClick={addFoodToMeal}
                  disabled={!currentItem.name}
                >
                  Add Food
                </Button>
              </div>
              
              {/* Food Items List */}
              {newMeal.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Food Items</h3>
                  
                  <div className="space-y-2">
                    {newMeal.items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {item.calories} cal ({item.servings > 1 ? `${item.servings}x ` : ''}
                            {item.servingSize}g)
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => removeFoodItem(item.id)}
                          className="text-gray-400 hover:text-danger-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-gray-100 rounded-md">
                    <div className="text-sm">
                      <span className="text-gray-500">Total Calories: </span>
                      <span className="font-medium">{newMeal.totalCalories}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Total Protein: </span>
                      <span className="font-medium">{newMeal.totalProtein}g</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Total Carbs: </span>
                      <span className="font-medium">{newMeal.totalCarbs}g</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Total Fat: </span>
                      <span className="font-medium">{newMeal.totalFat}g</span>
                    </div>
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
                  onClick={handleSubmitMeal}
                  disabled={newMeal.items.length === 0}
                >
                  Save Meal
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Meals List */}
      <div className="space-y-4">
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onDelete={deleteMeal} />
          ))
        ) : (
          <Card className="p-6 text-center">
            <Pizza size={32} className="mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No meals found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Try adjusting your search" 
                : "Start tracking your nutrition"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)}>
                Log Your First Meal
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

// Meal Card Component
const MealCard: React.FC<{ 
  meal: Meal; 
  onDelete: (id: string) => void;
}> = ({ meal, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Function to capitalize first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className="p-1.5 bg-complementary-50 rounded-md text-complementary-600 mr-2">
                <Pizza size={18} />
              </div>
              <h3 className="font-medium text-gray-900">{capitalize(meal.type)}</h3>
            </div>
            
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              {format(new Date(meal.date), 'h:mm a')}
              <span className="mx-2">•</span>
              <span>{meal.totalCalories} calories</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm font-medium mr-2">
              <span className="text-primary-600">{meal.totalProtein}g</span>
              <span className="mx-1 text-gray-300">|</span>
              <span className="text-accent-600">{meal.totalCarbs}g</span>
              <span className="mx-1 text-gray-300">|</span>
              <span className="text-complementary-600">{meal.totalFat}g</span>
            </div>
            
            <button 
              className="p-1.5 text-gray-400 hover:text-complementary-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">Food Items</h4>
              
              <div className="space-y-2 mb-4">
                {meal.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {item.servings > 1 ? `${item.servings} × ` : ''}
                        {item.servingSize}g
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{item.calories} cal</span>
                      <span className="text-gray-500 ml-1">
                        ({item.protein}g P | {item.carbs}g C | {item.fat}g F)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {meal.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{meal.notes}</p>
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
                    onDelete(meal.id);
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

export default NutritionTracker;