import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Icon from "@/components/custom/Icon";
import {
  TypographyH2,
  TypographyH3,
  TypographyMuted,
  TypographySmall,
  TypographyH5,
} from "@/components/custom/Typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminRevenue = () => {
  const [timeRange, setTimeRange] = useState("30");
  const [selectedPlan, setSelectedPlan] = useState("all");

  const revenueStats = [
    {
      label: "Total Revenue",
      value: 24580,
      change: 18,
      trend: "up",
      icon: "DollarSign",
      color: "green",
    },
    {
      label: "Monthly Recurring",
      value: 18420,
      change: 12,
      trend: "up",
      icon: "TrendingUp",
      color: "blue",
    },
    {
      label: "Avg Revenue/User",
      value: 23.45,
      change: 5,
      trend: "up",
      icon: "Users",
      color: "purple",
    },
    {
      label: "Churn Rate",
      value: 2.3,
      change: -0.5,
      trend: "down",
      icon: "TrendingDown",
      color: "red",
    },
  ];

  const planRevenue = [
    { plan: "Free", users: 8420, revenue: 0 },
    { plan: "Pro", users: 3240, revenue: 61560 },
    { plan: "Business", users: 1187, revenue: 58163 },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 15420 },
    { month: "Feb", revenue: 18650 },
    { month: "Mar", revenue: 21340 },
    { month: "Apr", revenue: 19870 },
    { month: "May", revenue: 23450 },
    { month: "Jun", revenue: 26780 },
    { month: "Jul", revenue: 24580 },
  ];

  const recentTransactions = [
    {
      id: 1,
      user: "John Doe",
      email: "john@example.com",
      plan: "Pro",
      amount: 1900,
      status: "completed",
      date: "2024-01-20",
      gateway: "stripe",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      email: "sarah@company.com",
      plan: "Business",
      amount: 4900,
      status: "completed",
      date: "2024-01-20",
      gateway: "paypal",
    },
    {
      id: 3,
      user: "Mike Johnson",
      email: "mike@startup.io",
      plan: "Pro",
      amount: 1900,
      status: "pending",
      date: "2024-01-19",
      gateway: "stripe",
    },
  ];

  const getStatusColor = (status) =>
    ({
      completed: "text-green-700 bg-green-50",
      pending: "text-yellow-700 bg-yellow-50",
      failed: "text-red-700 bg-red-50",
    }[status] || "text-gray-700 bg-gray-50");

  const getGatewayColor = (gateway) =>
    ({
      stripe: "text-blue-700 bg-blue-50",
      paypal: "text-purple-700 bg-purple-50",
      razorpay: "text-green-700 bg-green-50",
    }[gateway] || "text-gray-700 bg-gray-50");

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TypographyH2>Revenue Analytics</TypographyH2>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="md:w-[180px] w-full">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Icon name="Download" size={20} />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueStats.map((stat, i) => (
          <div
            key={i}
            className="flex justify-between px-3 py-6 bg-card rounded-md items-center"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <Icon name={stat.icon} size={20} />
              </div>
              <div>
                <TypographyH3>
                  {stat.trend === "down"
                    ? stat.value
                    : `₹${stat.value.toLocaleString()}`}
                </TypographyH3>
                <TypographyMuted>{stat.label}</TypographyMuted>
              </div>
            </div>
            <div
              className={`${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              } flex items-center text-sm`}
            >
              {stat.trend === "up" ? (
                <Icon name="TrendingUp" size={20} className="mr-2" />
              ) : (
                <Icon name="TrendingDown" size={20} className="mr-2" />
              )}
              {stat.change > 0 ? `+${stat.change}%` : `${stat.change}%`}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <div className="flex justify-between">
            <TypographyH3>Revenue Trend</TypographyH3>
            <Icon
              name="BarChart3"
              size={20}
              className="text-muted-foreground"
            />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 13, fill: "#4B5563" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 13, fill: "#4B5563" }}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar
                  dataKey="revenue"
                  fill="#3B82F6"
                  radius={[0, 0, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Plan Revenue */}
        <Card>
          <div className="flex justify-between mb-4">
            <TypographyH3>Revenue by Plan</TypographyH3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planRevenue}
                    dataKey="revenue"
                    nameKey="plan"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {planRevenue.map((p, i) => {
                      let color =
                        p.plan === "Pro"
                          ? "#3B82F6"
                          : p.plan === "Business"
                          ? "#8B5CF6"
                          : "#9CA3AF";
                      return <Cell key={i} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Plan Info */}
            <div className="flex-1 space-y-3 w-full lg:w-1/2">
              {planRevenue.map((p, i) => {
                const totalRevenue = planRevenue.reduce(
                  (a, b) => a + b.revenue,
                  0
                );
                const percentage = totalRevenue
                  ? ((p.revenue / totalRevenue) * 100).toFixed(0)
                  : 0;
                const color =
                  p.plan === "Pro"
                    ? "bg-blue-600"
                    : p.plan === "Business"
                    ? "bg-purple-600"
                    : "bg-gray-400";
                return (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${color}`} />
                      <div>
                        <TypographySmall>{p.plan}</TypographySmall>
                        <TypographyMuted>
                          {p.users.toLocaleString()} users
                        </TypographyMuted>
                      </div>
                    </div>
                    <div className="text-right">
                      <TypographyH5>₹{p.revenue.toLocaleString()}</TypographyH5>
                      <TypographyMuted>{percentage}%</TypographyMuted>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex justify-between mb-3">
          <TypographyH3>Recent Transactions</TypographyH3>
          <div className="flex items-center space-x-3">
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="link">View All</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {["User", "Plan", "Amount", "Gateway", "Status", "Date"].map(
                (h, i) => (
                  <TableHead key={i}>{h}</TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="font-medium">{t.user}</div>
                  <TypographyMuted>{t.email}</TypographyMuted>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getGatewayColor(
                      t.gateway
                    )}`}
                  >
                    {t.plan}
                  </span>
                </TableCell>
                <TableCell>₹{t.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getGatewayColor(
                      t.gateway
                    )}`}
                  >
                    {t.gateway}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </TableCell>
                <TableCell>{t.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Payment Gateway Performance */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: "Stripe", color: "blue", rate: 68 },
          { name: "PayPal", color: "purple", rate: 23 },
          { name: "Razorpay", color: "green", rate: 9 },
        ].map((pg, i) => (
          <Card
            key={i}
            className={`text-center flex justify-center items-center gap-1 bg-${pg.color}-50 rounded-lg`}
          >
            <Icon
              name="CreditCard"
              size={32}
              className={`text-${pg.color}-600`}
            />
            <div className="font-semibold">{pg.name}</div>
            <div className={`text-2xl font-bold text-${pg.color}-600`}>
              {pg.rate}%
            </div>
            <TypographyMuted>Success Rate</TypographyMuted>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminRevenue;
