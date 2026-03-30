'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export type TaskCategoryItem = {
  name: string;
  value: number;
  color: string;
};

type EcosystemPulseTasksChartProps = {
  data?: TaskCategoryItem[];
  title?: string;
};

const DEFAULT_DATA: TaskCategoryItem[] = [
  { name: 'Delivery', value: 32, color: '#E84E3A' },
  { name: 'Cleaning', value: 22, color: '#F97316' },
  { name: 'Tech', value: 20, color: '#1A3A4A' },
  { name: 'Handyman', value: 14, color: '#F5C842' },
  { name: 'Other', value: 12, color: '#2CB5A0' },
];

const LegendDot = ({ color }: { color: string }) => (
  <span
    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
    style={{ backgroundColor: color }}
  />
);

export default function EcosystemPulseTasksChart({
  data = DEFAULT_DATA,
  title = 'Tasks by Category',
}: EcosystemPulseTasksChartProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col items-center">
      {/* Title */}
      <h3 className="text-lg font-semibold text-textBlack self-start mb-4">{title}</h3>

      {/* Pie chart */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name as string]}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-sm text-textGray">
            <LegendDot color={item.color} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}