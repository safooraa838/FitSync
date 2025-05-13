import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface CalorieData {
  date: string;
  value: number;
}

interface CalorieBalanceChartProps {
  caloriesConsumed: CalorieData[];
  caloriesBurned: CalorieData[];
  className?: string;
}

const CalorieBalanceChart: React.FC<CalorieBalanceChartProps> = ({
  caloriesConsumed,
  caloriesBurned,
  className = '',
}) => {
  // Merge the two datasets by date
  const mergedData = caloriesConsumed.map(consumed => {
    const burned = caloriesBurned.find(
      burned => burned.date === consumed.date
    );
    return {
      date: format(new Date(consumed.date), 'EEE'),
      fullDate: consumed.date,
      consumed: consumed.value,
      burned: burned ? burned.value : 0,
      balance: consumed.value - (burned ? burned.value : 0),
    };
  });

  return (
    <div className={`${className}`}>
      <h3 className="text-base font-medium text-gray-900 mb-2">Calorie Balance (Last 7 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mergedData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickLine={false} 
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false} 
              axisLine={{ stroke: '#e5e7eb' }}
              width={50}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const formattedName = name === 'consumed' 
                  ? 'Consumed' 
                  : name === 'burned' 
                    ? 'Burned' 
                    : 'Balance';
                return [`${value} kcal`, formattedName];
              }}
              labelFormatter={(label) => {
                const item = mergedData.find(d => d.date === label);
                return item ? format(new Date(item.fullDate), 'EEEE, MMMM d') : label;
              }}
              contentStyle={{ 
                borderRadius: '0.5rem', 
                border: 'none', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value) => {
                return value === 'consumed' 
                  ? 'Calories Consumed' 
                  : value === 'burned' 
                    ? 'Calories Burned' 
                    : 'Balance';
              }}
            />
            <Bar dataKey="consumed" fill="#F97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="burned" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CalorieBalanceChart;