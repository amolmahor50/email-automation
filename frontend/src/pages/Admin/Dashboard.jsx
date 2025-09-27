import React from "react";
import {
  Users,
  DollarSign,
  Mail,
  TrendingUp,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      label: "Total Users",
      value: "12,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      label: "Monthly Revenue",
      value: "$24,580",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Emails Sent",
      value: "1.2M",
      change: "+25%",
      trend: "up",
      icon: Mail,
      color: "purple",
    },
    {
      label: "Active Templates",
      value: "2,341",
      change: "+8%",
      trend: "up",
      icon: FileText,
      color: "orange",
    },
  ];

  const recentUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      plan: "Pro",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@company.com",
      plan: "Business",
      status: "active",
      joinDate: "2024-01-14",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@startup.io",
      plan: "Free",
      status: "active",
      joinDate: "2024-01-13",
    },
    {
      id: "4",
      name: "Emily Chen",
      email: "emily@tech.com",
      plan: "Pro",
      status: "suspended",
      joinDate: "2024-01-12",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david@agency.com",
      plan: "Business",
      status: "active",
      joinDate: "2024-01-11",
    },
  ];

  const systemAlerts = [
    {
      id: "1",
      type: "warning",
      message: "High email bounce rate detected",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "info",
      message: "Monthly backup completed successfully",
      time: "4 hours ago",
    },
    {
      id: "3",
      type: "error",
      message: "Payment gateway timeout issues",
      time: "6 hours ago",
    },
    {
      id: "4",
      type: "success",
      message: "System update deployed successfully",
      time: "1 day ago",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-700 bg-green-50";
      case "suspended":
        return "text-red-700 bg-red-50";
      case "pending":
        return "text-yellow-700 bg-yellow-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Business":
        return "text-purple-700 bg-purple-50";
      case "Pro":
        return "text-blue-700 bg-blue-50";
      case "Free":
        return "text-gray-700 bg-gray-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Overview of system performance and user activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Users
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(
                        user.plan
                      )}`}
                    >
                      {user.plan}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              System Alerts
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {alert.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[40, 65, 45, 80, 60, 90, 75].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-blue-100 rounded-t-lg flex items-end"
              >
                <div
                  className="w-full bg-blue-600 rounded-t-lg transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[30, 50, 70, 45, 85, 60, 95].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-green-100 rounded-t-lg flex items-end"
              >
                <div
                  className="w-full bg-green-600 rounded-t-lg transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium text-gray-900">Manage Users</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium text-gray-900">View Revenue</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group">
            <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium text-gray-900">Templates</div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors group">
            <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium text-gray-900">System Logs</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
