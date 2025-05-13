import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface WeightData {
  date: string;
  value: number;
}

interface WeightProgressChartProps {
  data: WeightData[];
  className?: string;
}

const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  data,
  className = '',
}) => {
  // Format the data for the chart
  const formattedData = data.map(item => ({
    date: format(new Date(item.date), 'MMM d'),
    weight: item.value,
    fullDate: item.date
  }));

  return (
    <div className={`${className}`}>
      <h3 className="text-base font-medium text-gray-900 mb-2">Weight Progress</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
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
              domain={['dataMin - 1', 'dataMax + 1']}
              width={40}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} kg`, 'Weight']}
              labelFormatter={(label) => formattedData.find(d => d.date === label)?.fullDate || label}
              contentStyle={{ 
                borderRadius: '0.5rem', 
                border: 'none', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightProgressChart;