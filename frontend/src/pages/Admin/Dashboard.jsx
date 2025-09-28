import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  TypographyH2,
  TypographyH3,
  TypographyMuted,
  TypographySmall,
} from "@/components/custom/Typography";
import Icon from "@/components/custom/Icon";

// ---------- Dummy Data ----------
const stats = [
  {
    label: "Total Users",
    value: "12,847",
    change: "+12%",
    icon: "Users",
    color: "blue",
  },
  {
    label: "Monthly Revenue",
    value: "₹24,580",
    change: "+18%",
    icon: "DollarSign",
    color: "green",
  },
  {
    label: "Emails Sent",
    value: "1.2M",
    change: "+25%",
    icon: "Mail",
    color: "purple",
  },
  {
    label: "Active Templates",
    value: "2,341",
    change: "+8%",
    icon: "FileText",
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
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@company.com",
    plan: "Business",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@startup.io",
    plan: "Free",
    status: "active",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@tech.com",
    plan: "Pro",
    status: "suspended",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@agency.com",
    plan: "Business",
    status: "active",
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

const userGrowthData = [
  { day: "Mon", users: 40 },
  { day: "Tue", users: 65 },
  { day: "Wed", users: 45 },
  { day: "Thu", users: 80 },
  { day: "Fri", users: 60 },
  { day: "Sat", users: 90 },
  { day: "Sun", users: 75 },
];

const revenueData = [
  { month: "Jan", revenue: 3000 },
  { month: "Feb", revenue: 5000 },
  { month: "Mar", revenue: 7000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 8500 },
  { month: "Jun", revenue: 6000 },
  { month: "Jul", revenue: 9500 },
];

// ---------- Helpers ----------
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
      return <Icon name="AlertTriangle" className="text-red-500" size={20} />;
    case "warning":
      return (
        <Icon name="AlertTriangle" className="text-yellow-500" size={20} />
      );

    case "success":
      return <Icon name="CheckCircle2" className="text-red-500" size={20} />;
    default:
      return <Icon name="Clock" className="text-blue-500" size={20} />;
  }
};

// ---------- Component ----------
const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <TypographyH2>Admin Dashboard</TypographyH2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="gap-0">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-4 rounded-full", `bg-${stat.color}-100`)}>
                  <Icon name={stat?.icon} size={20} />
                </div>
                <div>
                  <TypographyH3>{stat.value}</TypographyH3>
                  <TypographyMuted>{stat.label}</TypographyMuted>
                </div>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <Icon name="TrendingUp" className="mr-1" size={20} />
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="gap-0 space-y-4">
          <div>
            <TypographyH3>Recent User</TypographyH3>
            <TypographyMuted>Latest signups</TypographyMuted>
          </div>
          <div>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="Users" size={20} />
                    </div>
                    <div>
                      <TypographySmall>{user.name}</TypographySmall>
                      <TypographyMuted>{user.email}</TypographyMuted>
                    </div>
                  </div>
                  <div className="flex md:flex-row flex-col gap-2 items-center">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getPlanColor(user.plan)
                      )}
                    >
                      {user.plan}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(user.status)
                      )}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="gap-0 space-y-4">
          <TypographyH3>System Alerts</TypographyH3>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {getAlertIcon(alert.type)}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-500">{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="gap-0 space-y-4 p-4">
          <TypographyH3>User Growth</TypographyH3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip contentStyle={{ fontSize: 13 }} />
              <Bar
                dataKey="users"
                fill="#3b82f6"
                radius={[0, 0, 0, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="gap-0 space-y-4 p-4">
          <TypographyH3>Revenue Trend</TypographyH3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip contentStyle={{ fontSize: 13 }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="gap-0 space-y-4">
        <TypographyH3>Quick Actions</TypographyH3>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="p-4 flex justify-center items-center gap-2 flex-col bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group"
            >
              <Icon name="Users" className="text-blue-600" size={24} />
              <TypographySmall>Manage Users</TypographySmall>
            </Link>
            <Link
              to="/admin/revenue"
              className="p-4 flex justify-center items-center gap-2 flex-col bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group"
            >
              <Icon name="DollarSign" className="text-green-600" size={24} />
              <TypographySmall>View Revenue</TypographySmall>
            </Link>
            <Link
              to="/admin/templates"
              className="p-4 flex justify-center items-center gap-2 flex-col bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group"
            >
              <Icon name="FileText" className="text-purple-600" size={24} />
              <TypographySmall>Templates</TypographySmall>
            </Link>
            <Link
              to=""
              className="p-4 flex justify-center items-center gap-2 flex-col bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors group"
            >
              <Icon name="Calendar" className="text-orange-600" size={24} />
              <TypographySmall>System Logs</TypographySmall>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
