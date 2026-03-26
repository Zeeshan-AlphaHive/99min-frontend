import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartPoint = {
  month: string;
  current: number;
  previous: number;
};

type EcosystemPulseTrendsGraphProps = {
  data: ChartPoint[];
};

export default function EcosystemPulseTrendsGraph({ data }: EcosystemPulseTrendsGraphProps) {
  return (
    <div className="lg:col-span-2 border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-textBlack">Revenue Trend</h3>
          <p className="text-sm text-textGray">Showing 6 months</p>
        </div>

        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          <button type="button" className="px-4 py-1.5 text-sm font-medium bg-orange text-white rounded-md shadow-sm">
            Daily
          </button>
          <button type="button" className="px-4 py-1.5 text-sm font-medium text-textGray hover:text-textBlack rounded-md">
            Month
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orange)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-orange)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orangeHover)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--color-orangeHover)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-lightGrey)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-textGray)' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-textGray)' }}
              ticks={[0, 25000, 50000, 75000, 100000]}
              tickFormatter={(value) => (value === 0 ? '0' : `${value / 1000}k`)}
            />
            <Tooltip />

            <Area type="monotone" dataKey="current" stroke="var(--color-orange)" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" />
            <Area type="monotone" dataKey="previous" stroke="var(--color-orangeHover)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-4">
        <div className="flex items-center text-sm font-medium text-textBlack mb-1">
          Trending up by <span className="text-green-500 mx-1">5.2%</span> this month
          <TrendingUp className="w-4 h-4 ml-1 text-textBlack" />
        </div>
        <p className="text-sm text-textGray">January - June 2024</p>
      </div>
    </div>
  );
}
