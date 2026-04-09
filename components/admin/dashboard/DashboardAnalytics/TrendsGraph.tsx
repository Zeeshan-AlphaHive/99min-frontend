'use client';

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
  previous?: number;
};

type EcosystemPulseTrendsGraphProps = {
  data: ChartPoint[];
  title?: string;
  subtitle?: string;
  trendLabel?: string;
  periodLabel?: string;
};

export default function EcosystemPulseTrendsGraph({
  data,
  title = 'User Growth',
  subtitle = 'Showing 6 months',
  trendLabel = '5.2%',
  periodLabel = 'January - June 2024',
}: EcosystemPulseTrendsGraphProps) {
  const max = Math.max(0, ...(data ?? []).map((d) => Number(d.current) || 0));
  const yMax = max <= 5 ? 10 : Math.ceil(max * 1.2);

  const formatTick = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
    return String(v);
  };

  return (
    <div className="lg:col-span-2 border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-textBlack">{title}</h3>
          <p className="text-sm text-textGray">{subtitle}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              dy={10}
              tickFormatter={(v) => (typeof v === 'string' ? v.slice(5) : String(v))}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, yMax]}
              tickFormatter={formatTick}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#F97316"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCurrent)"
              dot={false}
              activeDot={{ r: 4, fill: '#F97316' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm font-medium text-textBlack mb-1">
          Trending up by&nbsp;
          <span className="text-green-500">{trendLabel}</span>&nbsp;this month
          <TrendingUp className="w-4 h-4 ml-1 text-textBlack" />
        </div>
        <p className="text-sm text-textGray">{periodLabel}</p>
      </div>
    </div>
  );
}