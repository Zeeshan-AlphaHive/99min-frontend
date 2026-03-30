'use client';

import React from 'react';
import { Briefcase, DollarSign, Users } from 'lucide-react';
import EcosystemPulseStatCard from '@/components/admin/dashboard/DashboardAnalytics/StatCard';
import EcosystemPulseTrendsGraph from '@/components/admin/dashboard/DashboardAnalytics/TrendsGraph';
import EcosystemPulseTasksChart from '@/components/admin/dashboard/DashboardAnalytics/Chart';

// ── Chart data ────────────────────────────────────────────────────────────────
const userGrowthData = [
  { month: 'Jan', current: 40000 },
  { month: 'Feb', current: 75000 },
  { month: 'Mar', current: 50000 },
  { month: 'Apr', current: 38000 },
  { month: 'May', current: 50000 },
  { month: 'Jun', current: 52000 },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ── Header ── */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-textBlack mb-1">Overview</h1>
        <p className="text-sm text-textGray">
          Real-time performance across web &amp; mobile platforms.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <EcosystemPulseStatCard
          title="Total Users"
          value="14,285"
          icon={<Users className="w-5 h-5" />}
          iconContainerClassName="bg-red-100 text-red-500"
          changePercent="25%"
          changeLabel="this month"
        />

        <EcosystemPulseStatCard
          title="Active Tasks"
          value="1,429"
          icon={<Briefcase className="w-5 h-5" />}
          iconContainerClassName="bg-orange-100 text-orange-500"
          changePercent="25%"
          changeLabel="this month"
        />

        <EcosystemPulseStatCard
          title="Revenue"
          value="$42,500"
          icon={<DollarSign className="w-5 h-5" />}
          iconContainerClassName="bg-green-100 text-green-500"
          changePercent="5%"
          changeLabel="ongoing now"
        />

        {/* <EcosystemPulseStatCard
          title="Messages"
          value="842"
          icon={<MessageSquare className="w-5 h-5" />}
          iconContainerClassName="bg-purple-100 text-purple-500"
          changePercent="1.5%"
          changeLabel="ongoing now"
        /> */}
      </div>

      {/* ── Main charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart — spans 2 cols on large screens */}
        <EcosystemPulseTrendsGraph
          data={userGrowthData}
          title="User Growth"
          subtitle="Showing 6 months"
          trendLabel="5.2%"
          periodLabel="January - June 2024"
        />

        {/* Pie / donut chart — 1 col */}
        <EcosystemPulseTasksChart title="Tasks by Category" />
      </div>
    </div>
  );
}