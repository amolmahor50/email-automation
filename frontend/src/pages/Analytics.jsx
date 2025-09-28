import React, { useState } from "react";
import { useEffect } from "react";
import {
  TrendingUp,
  Eye,
  MousePointer,
  Mail,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import { emailService } from "@/services/emailService";

const Analytics = () => {
  const { emails, loadEmails } = useApp();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30");

  const {
    data: analytics,
    loading,
    execute: loadAnalytics,
  } = useApi(() => emailService.getEmailAnalytics(), { immediate: false });

  useEffect(() => {
    loadEmails();
    loadAnalytics();
  }, [timeRange]);

  // Filter emails by time range
  const filteredEmails = emails.filter((email) => {
    const emailDate = new Date(email.createdAt);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
    return emailDate >= cutoffDate && email.status === "sent";
  });

  // Calculate metrics
  const totalSent = analytics?.sentEmails || 0;
  const totalOpens = analytics?.totalOpens || 0;
  const totalClicks = analytics?.totalClicks || 0;
  const uniqueOpens = analytics?.uniqueOpens || 0;

  const openRate = analytics?.openRate?.toFixed(1) || "0";
  const clickRate = analytics?.clickRate?.toFixed(1) || "0";
  const clickToOpenRate =
    totalOpens > 0 ? ((totalClicks / totalOpens) * 100).toFixed(1) : "0";

  // Top performing emails
  const topEmails = filteredEmails
    .sort(
      (a, b) =>
        b.analytics.opens +
        b.analytics.clicks -
        (a.analytics.opens + a.analytics.clicks)
    )
    .slice(0, 5);

  // Email activity by day
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayEmails = filteredEmails.filter((email) => {
      const emailDate = new Date(email.createdAt);
      return emailDate.toDateString() === date.toDateString();
    });

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      sent: dayEmails.length,
      opens: dayEmails.reduce((sum, email) => sum + email.analytics.opens, 0),
      clicks: dayEmails.reduce((sum, email) => sum + email.analytics.clicks, 0),
    };
  }).reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.subscription.plan === "free") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Track your email performance and engagement
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-8 text-white text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-4">Unlock Advanced Analytics</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get detailed insights into your email performance with open rates,
            click tracking, engagement metrics, and more with our Pro plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/pricing")}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Upgrade to Pro
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* Basic metrics for free users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">{totalSent}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-xs text-purple-600 font-medium">
                  Pro Feature
                </p>
              </div>
              <Eye className="w-8 h-8 text-gray-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-xs text-purple-600 font-medium">
                  Pro Feature
                </p>
              </div>
              <MousePointer className="w-8 h-8 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Track your email performance and engagement
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{totalSent}</div>
            <div className="text-sm text-gray-600">Emails Sent</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{openRate}%</div>
            <div className="text-sm text-gray-600">Open Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+15%</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{clickRate}%</div>
            <div className="text-sm text-gray-600">Click Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+5%</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {clickToOpenRate}%
            </div>
            <div className="text-sm text-gray-600">Click-to-Open</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Email Activity
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {activityData.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {day.day}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(
                          (day.sent /
                            Math.max(...activityData.map((d) => d.sent))) *
                            100,
                          5
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{day.sent} sent</span>
                  <span>{day.opens} opens</span>
                  <span>{day.clicks} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Emails */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Performing Emails
            </h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {topEmails.map((email, index) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {email.subject}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    To: {email.recipients.join(", ")}
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-blue-600">
                      {email.analytics.opens}
                    </div>
                    <div className="text-gray-500">opens</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600">
                      {email.analytics.clicks}
                    </div>
                    <div className="text-gray-500">clicks</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Insights & Recommendations
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Best Send Time</h3>
            </div>
            <p className="text-sm text-blue-800">
              Your emails perform best when sent on Tuesday at 10 AM. Consider
              scheduling future emails around this time.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-green-900">Engagement Trend</h3>
            </div>
            <p className="text-sm text-green-800">
              Your open rates have improved by 15% this month. Keep using
              personalized subject lines for better results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
