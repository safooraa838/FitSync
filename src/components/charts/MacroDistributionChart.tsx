import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MacroDistribution {
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroDistributionChartProps {
  data: MacroDistribution;
  className?: string;
}

const MacroDistributionChart: React.FC<MacroDistributionChartProps> = ({
  data,
  className = '',
}) => {
  const chartData = [
    { name: 'Protein', value: data.protein, color: '#3B82F6' }, // primary-500
    { name: 'Carbs', value: data.carbs, color: '#10B981' },     // accent-500
    { name: 'Fat', value: data.fat, color: '#F97316' },         // complementary-500
  ];

  return (
    <div className={`${className}`}>
      <h3 className="text-base font-medium text-gray-900 mb-2">Macro Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={500}
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}%`, '']}
              contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              iconType="circle" 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MacroDistributionChart;