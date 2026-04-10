'use client';

import React, { useState } from 'react';
import { Briefcase, DollarSign, Users } from 'lucide-react';
import EcosystemPulseStatCard    from '@/components/admin/dashboard/DashboardAnalytics/StatCard';
import EcosystemPulseTrendsGraph from '@/components/admin/dashboard/DashboardAnalytics/TrendsGraph';
// import EcosystemPulseTasksChart  from '@/components/admin/dashboard/DashboardAnalytics/Chart';
import { useDashboardStats, useUserChart} from '@/hooks/UseAdminDashboard';
// import {  useCategoryChart } from '@/hooks/UseAdminDashboard';
const fmt      = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const fmtMoney = (n: number) => `$${(n / 100).toLocaleString()}`;

// const CATEGORY_COLORS: Record<string, string> = {
//   errands:     '#E84E3A',
//   tech:        '#1A3A4A',
//   design:      '#F97316',
//   moving:      '#F5C842',
//   'pet-care':  '#2CB5A0',
//   translation: '#8B5CF6',
// };

const toYmd = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function DashboardPage() {
  const [period] = useState('30d');

  const { data: statsData,    isLoading: statsLoading } = useDashboardStats();
  const { data: chartData }                             = useUserChart(period);
  // const { data: categoryData }                          = useCategoryChart();

  const stats = statsData?.data;

  // Backend returns "new users per day" (sparse). For a proper "growth" chart,
  // we render a continuous daily series with a cumulative line.
  const userGrowthData = (() => {
    const raw = chartData?.data ?? [];
    const map = new Map<string, number>(raw.map((p) => [p.date, p.count]));

    const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '12m' ? 30 : 30;
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const points: { month: string; current: number }[] = [];
    let cumulative = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = toYmd(d);
      cumulative += map.get(key) ?? 0;
      points.push({ month: key, current: cumulative });
    }
    return points;
  })();

  // const categoryChartData = (categoryData?.data ?? []).map((p) => ({
  //   name:  p.category.charAt(0).toUpperCase() + p.category.slice(1),
  //   value: p.count,
  //   color: CATEGORY_COLORS[p.category] ?? '#6B7280',
  // }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-textBlack mb-1">Overview</h1>
        <p className="text-sm text-textGray">
          Real-time performance across web &amp; mobile platforms.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <EcosystemPulseStatCard
          title="Total Users"
          value={statsLoading ? '...' : fmt(stats?.users.total ?? 0)}
          icon={<Users className="w-5 h-5" />}
          iconContainerClassName="bg-red-100 text-red-500"
          changePercent={`+${stats?.users.newThisMonth ?? 0}`}
          changeLabel="new this month"
        />
        <EcosystemPulseStatCard
          title="Active Tasks"
          value={statsLoading ? '...' : fmt(stats?.tasks.active ?? 0)}
          icon={<Briefcase className="w-5 h-5" />}
          iconContainerClassName="bg-orange-100 text-orange-500"
          changePercent={`+${stats?.tasks.newThisMonth ?? 0}`}
          changeLabel="new this month"
        />
        <EcosystemPulseStatCard
          title="Revenue (MRR)"
          value={statsLoading ? '...' : fmtMoney(stats?.revenue.totalMrr ?? 0)}
          icon={<DollarSign className="w-5 h-5" />}
          iconContainerClassName="bg-green-100 text-green-500"
          changePercent={`+${fmtMoney(stats?.revenue.newThisMonth ?? 0)}`}
          changeLabel="this month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EcosystemPulseTrendsGraph
          data={userGrowthData}
          title="User Growth"
          subtitle={`Last ${period}`}
          trendLabel=""
          periodLabel=""
        />
        {/* <EcosystemPulseTasksChart
          title="Tasks by Category"
          data={categoryChartData.length > 0 ? categoryChartData : undefined}
        /> */}
      </div>
    </div>
  );
}