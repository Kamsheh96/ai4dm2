import React from 'react';
import { NotificationWidget } from './NotificationWidget';
import { AssessmentsWidget } from './AssessmentsWidget';
import { WorkstreamGrid } from './WorkstreamGrid';
import { DashboardBottomPanel } from './DashboardBottomPanel';

export const DashboardHome: React.FC = () => {

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Welcome back! Here's what's happening with your data management work.
        </p>
      </div>

      {/* Top Row: Notifications and Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationWidget />
        <AssessmentsWidget />
      </div>

      {/* Workstreams Section */}
      <div className="section-divider"></div>
      <WorkstreamGrid />

      {/* Bottom Dashboard Panel */}
      <DashboardBottomPanel />
    </div>
  );
};