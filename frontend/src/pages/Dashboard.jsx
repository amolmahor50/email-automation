import React from "react";
import { useEffect } from "react";
import {
  Mail,
  FileText,
  Send,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useApi } from "@/hooks/useApi";
import { userService } from "@/services/userService";
import { Card } from "@/components/ui/card";
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyMuted,
  TypographySmall,
} from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { emails, templates, loadEmails, loadTemplates } = useApp();

  const { data: userStats, loading: statsLoading } = useApi(
    () => userService.getStats(),
    { immediate: true }
  );

  useEffect(() => {
    loadEmails();
    loadTemplates();
  }, []);

  const stats = [
    {
      label: "Emails Sent",
      value: userStats?.emailStats.sentEmails.toString() || "0",
      change: "+12%",
      trend: "up",
      icon: Mail,
      color: "blue",
    },
    {
      label: "Templates",
      value: templates.length.toString(),
      change: "+3",
      trend: "up",
      icon: FileText,
      color: "green",
    },
    {
      label: "Open Rate",
      value: userStats ? `${userStats.emailStats.openRate.toFixed(1)}%` : "0%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Scheduled",
      value: emails.filter((e) => e.status === "scheduled").length.toString(),
      change: "-2",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recentEmails = emails.slice(0, 5);
  const recentTemplates = templates.slice(0, 4);

  // console.log("dashboard recentEmails fetched---", recentEmails);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex md:items-center flex-col md:flex-row gap-4 justify-between">
          <div>
            <TypographyH2>Welcome back, {user?.name}! 👋</TypographyH2>
            <TypographyP>
              You have {emails.filter((e) => e.status === "scheduled").length}{" "}
              emails scheduled and {templates.length} templates ready to use.
            </TypographyP>
          </div>
          <div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-sm text-blue-100">Current Plan</div>
              <div className="font-semibold capitalize">
                {user?.subscription.plan}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";

          return (
            <Card key={index} className="gap-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full bg-${stat.color}-100`}>
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
                <div
                  className={`flex items-center text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Emails */}
        <Card className="gap-0">
          <div className="pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <TypographyH3>Recent Emails</TypographyH3>
              <Link to="/history">
                <Button variant="link">View all</Button>
              </Link>
            </div>
          </div>
          <div>
            <div className="space-y-4 mt-3">
              {recentEmails?.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 md:space-x-4 p-2 bg-secondary rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      email.status === "sent"
                        ? "bg-green-500"
                        : email.status === "scheduled"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <TypographySmall className="capitalize truncate">
                      {email.subject}
                    </TypographySmall>
                    <TypographyMuted className=" truncate">
                      To: {email?.recipients?.[0].email}
                    </TypographyMuted>
                  </div>
                  <div className="grid gap-1 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{email.analytics.opens}</span>
                    </div>
                    <TypographyMuted className="text-xs">
                      {new Date(email.createdAt).toLocaleDateString()}
                    </TypographyMuted>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions & Templates */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="gap-0 space-y-4">
            <TypographyH3>Quick Actions</TypographyH3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/compose"
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group"
              >
                <Send className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-medium text-gray-900">Compose Email</div>
                <div className="text-sm text-gray-600">Start writing</div>
              </Link>
              <Link
                to="/templates"
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group"
              >
                <FileText className="w-6 h-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-medium text-gray-900">New Template</div>
                <div className="text-sm text-gray-600">Create template</div>
              </Link>
            </div>
          </Card>

          {/* Popular Templates */}
          <Card className="gap-0">
            <TypographyH3 className="pb-3 border-b">
              Popular Templates
            </TypographyH3>
            <div>
              <div className="space-y-3">
                {recentTemplates.map((template, index) => (
                  <Link
                    to={`/templete/${template?._id}`}
                    key={index}
                    className="flex items-center py-1 px-4 cursor-pointer justify-between mt-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <TypographySmall className="capitalize">
                          {template.title}
                        </TypographySmall>
                        <TypographyMuted className="capitalize">
                          {template.category}
                        </TypographyMuted>
                      </div>
                    </div>
                    <Button variant="link">Use</Button>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
