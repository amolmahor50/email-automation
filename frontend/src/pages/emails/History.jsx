"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  X,
  Send,
  DraftingCompass,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
} from "@/components/custom/Typography";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

  const { emails, loadEmails, loading, resendEmail, setLoading } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    loadEmails();
  }, []);

  const isWithinDateRange = (da, range) => {
    const date = new Date(da);
    const now = new Date();
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);

    switch (range) {
      case "today":
        return daysDiff < 1;
      case "week":
        return daysDiff < 7;
      case "month":
        return daysDiff < 30;
      default:
        return true;
    }
  };

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.recipients.some((r) =>
        (r.email || r).toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || email.status === statusFilter;
    const matchesDate =
      dateFilter === "all" || isWithinDateRange(email.createdAt, dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleResend = async (id) => {
    try {
      setLoading(true);
      await resendEmail(id);
      toast.success("Email resent successfully");
      setLoading(false);
    } catch (err) {
      toast.error("Failed to resend email");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log(emails);

  return (
    <div className="space-y-6">
      {/* Header */}
      <TypographyH2>Email History</TypographyH2>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-fit">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-fit">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card className="md:p-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex text-gray-800 justify-center items-center rounded-full bg-green-300">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <TypographyH1>
                {emails.filter((e) => e.status === "sent").length}
              </TypographyH1>
            </div>
          </div>
        </Card>

        <Card className="md:p-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex text-gray-800 justify-center items-center rounded-full bg-red-300">
              <X size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Failed</p>
              <TypographyH1>
                {emails.filter((e) => e.status === "failed").length}
              </TypographyH1>
            </div>
          </div>
        </Card>

        <Card className="md:p-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex text-gray-800 justify-center items-center rounded-full bg-gray-300">
              <DraftingCompass size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Draft</p>
              <TypographyH1>
                {emails.filter((e) => e.status === "draft").length}
              </TypographyH1>
            </div>
          </div>
        </Card>

        <Card className="md:p-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex text-gray-800 justify-center items-center rounded-full bg-blue-300">
              <Eye size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Opens</p>
              <TypographyH1>
                {emails.reduce((sum, e) => sum + e.analytics.opens, 0)}
              </TypographyH1>
            </div>
          </div>
        </Card>

        <Card className="md:p-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex text-gray-800 justify-center items-center rounded-full bg-purple-300">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <TypographyH1>
                {emails.reduce((sum, e) => sum + e.analytics.clicks, 0)}
              </TypographyH1>
            </div>
          </div>
        </Card>

        <Card className="md:p-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex text-gray-800 justify-center items-center rounded-full bg-orange-300">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <TypographyH1>
                {emails.filter((e) => e.status === "scheduled").length}
              </TypographyH1>
            </div>
          </div>
        </Card>
      </div>

      {/* Emails Table */}
      <Card>
        <TypographyH3>Recent Emails ({filteredEmails.length})</TypographyH3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Analytics</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmails.map((email, index) => (
              <TableRow key={email.id || index}>
                <TableCell className="max-w-xs truncate">
                  <div className="font-medium">{email.subject}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {email.body.substring(0, 80)}...
                  </div>
                </TableCell>
                <TableCell>
                  {email.recipients.length === 1
                    ? email.recipients[0].email || email.recipients[0]
                    : `${email.recipients.length} recipients`}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      email.status
                    )}`}
                  >
                    {getStatusIcon(email.status)}
                    <span className="ml-1 capitalize">{email.status}</span>
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{email.analytics.opens}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{email.analytics.clicks}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(email.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/email/${email._id}/edit`)}
                      >
                        <Eye /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleResend(email?._id)}
                      >
                        <Send /> Resend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEmails.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <Mail className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">
              No emails found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "Try adjusting your filters to find more emails."
                : "Start by composing your first email."}
            </p>
            <Button onClick={() => (window.location.href = "/compose")}>
              Compose Email
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default History;
