import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Users,
  BarChart3,
  PieChart,
  Download,
  Filter,
} from "lucide-react";

const AdminRevenue = () => {
  const [timeRange, setTimeRange] = useState("30");
  const [selectedPlan, setSelectedPlan] = useState("all");

  const revenueStats = [
    {
      label: "Total Revenue",
      value: "$24,580",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Monthly Recurring",
      value: "$18,420",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
    },
    {
      label: "Average Revenue Per User",
      value: "$23.45",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "purple",
    },
    {
      label: "Churn Rate",
      value: "2.3%",
      change: "-0.5%",
      trend: "down",
      icon: TrendingDown,
      color: "red",
    },
  ];

  const recentTransactions = [
    {
      id: "1",
      user: "John Doe",
      email: "john@example.com",
      plan: "Pro",
      amount: 19,
      status: "completed",
      date: "2024-01-20",
      gateway: "stripe",
    },
    {
      id: "2",
      user: "Sarah Wilson",
      email: "sarah@company.com",
      plan: "Business",
      amount: 49,
      status: "completed",
      date: "2024-01-20",
      gateway: "paypal",
    },
    {
      id: "3",
      user: "Mike Johnson",
      email: "mike@startup.io",
      plan: "Pro",
      amount: 19,
      status: "pending",
      date: "2024-01-19",
      gateway: "stripe",
    },
    {
      id: "4",
      user: "Emily Chen",
      email: "emily@tech.com",
      plan: "Business",
      amount: 49,
      status: "failed",
      date: "2024-01-19",
      gateway: "razorpay",
    },
    {
      id: "5",
      user: "David Brown",
      email: "david@agency.com",
      plan: "Pro",
      amount: 19,
      status: "completed",
      date: "2024-01-18",
      gateway: "stripe",
    },
  ];

  const planRevenue = [
    { plan: "Free", users: 8420, revenue: 0, percentage: 0 },
    { plan: "Pro", users: 3240, revenue: 61560, percentage: 65 },
    { plan: "Business", users: 1187, revenue: 58163, percentage: 35 },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 15420, users: 1240 },
    { month: "Feb", revenue: 18650, users: 1380 },
    { month: "Mar", revenue: 21340, users: 1520 },
    { month: "Apr", revenue: 19870, users: 1450 },
    { month: "May", revenue: 23450, users: 1680 },
    { month: "Jun", revenue: 26780, users: 1820 },
    { month: "Jul", revenue: 24580, users: 1750 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-50";
      case "pending":
        return "text-yellow-700 bg-yellow-50";
      case "failed":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getGatewayColor = (gateway) => {
    switch (gateway) {
      case "stripe":
        return "text-blue-700 bg-blue-50";
      case "paypal":
        return "text-purple-700 bg-purple-50";
      case "razorpay":
        return "text-green-700 bg-green-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Revenue Analytics
          </h1>
          <p className="text-gray-600">
            Track revenue, subscriptions, and financial metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div
                  className={`flex items-center text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t-lg flex items-end mb-2">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-300"
                    style={{
                      height: `${
                        (data.revenue /
                          Math.max(...monthlyData.map((d) => d.revenue))) *
                        200
                      }px`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Revenue by Month</span>
            <span>
              Peak: $
              {Math.max(...monthlyData.map((d) => d.revenue)).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Plan Revenue Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue by Plan
            </h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {planRevenue.map((plan, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      plan.plan === "Pro"
                        ? "bg-blue-500"
                        : plan.plan === "Business"
                        ? "bg-purple-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{plan.plan}</div>
                    <div className="text-sm text-gray-600">
                      {plan.users.toLocaleString()} users
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${plan.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {plan.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total Revenue</span>
              <span>
                $
                {planRevenue
                  .reduce((sum, p) => sum + p.revenue, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Plans</option>
                <option value="pro">Pro</option>
                <option value="business">Business</option>
              </select>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gateway
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.user}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.plan === "Business"
                          ? "text-purple-700 bg-purple-50"
                          : transaction.plan === "Pro"
                          ? "text-blue-700 bg-blue-50"
                          : "text-gray-700 bg-gray-50"
                      }`}
                    >
                      {transaction.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      ${transaction.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGatewayColor(
                        transaction.gateway
                      )}`}
                    >
                      {transaction.gateway}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {transaction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Payment Gateway Performance
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Stripe</div>
            <div className="text-2xl font-bold text-blue-600">68%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">PayPal</div>
            <div className="text-2xl font-bold text-purple-600">23%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Razorpay</div>
            <div className="text-2xl font-bold text-green-600">9%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenue;
