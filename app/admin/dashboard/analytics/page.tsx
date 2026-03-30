'use client';

import React from 'react';
import {
  Briefcase,
  DollarSign,
  RefreshCw,
  Users,
} from 'lucide-react';
import EcosystemPulseStatCard from '@/components/admin/dashboard/DashboardAnalytics/StatCard';
import EcosystemPulseTrendsGraph from '@/components/admin/dashboard/DashboardAnalytics/TrendsGraph';
import EcosystemPulsePendingInvoices from '@/components/admin/dashboard/DashboardAnalytics/PendingInvoices';

const chartData = [
  { month: 'Jan', current: 40000, previous: 15000 },
  { month: 'Feb', current: 75000, previous: 30000 },
  { month: 'Mar', current: 50000, previous: 18000 },
  { month: 'Apr', current: 38000, previous: 25000 },
  { month: 'May', current: 50000, previous: 15000 },
  { month: 'Jun', current: 52000, previous: 20000 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textBlack mb-1">Ecosystem Pulse</h1>
        <p className="text-sm text-textGray">Real-time performance across web & mobile platforms.</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <EcosystemPulseStatCard
          title="Total Users"
          value="14,285"
          icon={<Users className="w-5 h-5" />}
          iconContainerClassName="bg-lightRed text-red"
          changePercent="25%"
          changeLabel="this month"
        />

        <EcosystemPulseStatCard
          title="Total Revenue"
          value="2,847"
          icon={<DollarSign className="w-5 h-5" />}
          iconContainerClassName="bg-lightGreen text-green"
          changePercent="25%"
          changeLabel="this month"
        />

       <EcosystemPulseStatCard
  title="Active Assets"
  value="1,204"
  icon={<Briefcase className="w-5 h-5" />}
  iconContainerClassName="bg-orange-100 text-orange-500"
  changePercent="5%"
  changeLabel="ongoing now"
/>

<EcosystemPulseStatCard
  title="Current Load"
  value="94.2%"
  icon={<RefreshCw className="w-5 h-5" />}
  iconContainerClassName="bg-purple-100 text-purple-500"
  changePercent="1.5%"
  changeLabel="ongoing now"
/>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EcosystemPulseTrendsGraph data={chartData} />
        <EcosystemPulsePendingInvoices />
      </div>
    </div>
  );
}
