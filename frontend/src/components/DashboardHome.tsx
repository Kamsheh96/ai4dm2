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

      {/* Main Content: Notifications and Assessments Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationWidget />
        <AssessmentsWidget />
      </div>

      {/* Unified Workstreams and Context Panel */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-850 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-8">
        <WorkstreamGrid />

        {/* AI Context and Quick Actions Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <DashboardBottomPanel />
        </div>
      </div>
    </div>
  );
};