'use client';

import React, { useState } from 'react';
import { Briefcase, DollarSign, Users } from 'lucide-react';
import EcosystemPulseStatCard    from '@/components/admin/dashboard/DashboardAnalytics/StatCard';
import EcosystemPulseTrendsGraph from '@/components/admin/dashboard/DashboardAnalytics/TrendsGraph';
import EcosystemPulseTasksChart  from '@/components/admin/dashboard/DashboardAnalytics/Chart';
import { useDashboardStats, useUserChart } from '@/hooks/UseAdminDashboard';

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const fmtMoney = (n: number) => `$${(n / 100).toLocaleString()}`;

export default function DashboardPage() {
  const [period, setPeriod] = useState('30d');

  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: chartData }                          = useUserChart(period);

  const stats = statsData?.data;

  const userGrowthData = (chartData?.data ?? []).map((p) => ({
    month: p.date,
    current: p.count,
  }));

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EcosystemPulseTrendsGraph
          data={userGrowthData}
          title="User Growth"
          subtitle={`Last ${period}`}
          trendLabel=""
          periodLabel=""
        />
        <EcosystemPulseTasksChart title="Tasks by Category" />
      </div>
    </div>
  );
}