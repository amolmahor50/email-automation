import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import Icon from "@/components/custom/Icon";
import {
  TypographyH2,
  TypographyH3,
  TypographyMuted,
} from "@/components/custom/Typography";

const AdminUsers = () => {
  // ==========================
  // Header / Filters state
  // ==========================
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // ==========================
  // Users state
  // ==========================
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      plan: "Pro",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20",
      emailsSent: 245,
      revenue: 19,
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@company.com",
      password: "abcdef",
      plan: "Business",
      status: "active",
      joinDate: "2024-01-14",
      lastActive: "2024-01-20",
      emailsSent: 1250,
      revenue: 49,
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@startup.io",
      password: "password",
      plan: "Free",
      status: "active",
      joinDate: "2024-01-13",
      lastActive: "2024-01-19",
      emailsSent: 45,
      revenue: 0,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  ]);

  // ==========================
  // Dialog & Form state
  // ==========================
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    plan: "Free",
    status: "active",
    revenue: 0,
  });

  const [errors, setErrors] = useState({});

  // ==========================
  // Helper functions
  // ==========================
  const suspendUser = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "suspended" } : u))
    );

  const activateUser = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "active" } : u))
    );

  const confirmDeleteUser = (id) => setDeleteUserId(id);

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
    setDeleteUserId(null);
  };

  const openEdit = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData(user);
    setErrors({});
  };

  const openCreate = () => {
    setIsEditing(false);
    setSelectedUser({});
    setFormData({
      name: "",
      email: "",
      password: "",
      plan: "Free",
      status: "active",
      revenue: 0,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (isEditing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...formData, id: u.id } : u
        )
      );
    } else {
      const newUser = {
        ...formData,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
        emailsSent: 0,
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesPlan =
      planFilter === "all" ||
      user.plan.toLowerCase() === planFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Icon name="CheckCircle2" size={20} /> Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <Icon name="XCircle" size={20} /> Suspended
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Icon name="Clock" size={20} /> Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case "Business":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            {plan}
          </Badge>
        );
      case "Pro":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {plan}
          </Badge>
        );
      case "Free":
        return <Badge variant="secondary">{plan}</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  // ==========================
  // Components
  // ==========================
  const HeaderSection = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <TypographyH2>User Management</TypographyH2>
      <Button onClick={openCreate}>
        <Icon name="Plus" size={20} /> Add User
      </Button>
    </div>
  );

  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-3 bg-card rounded-md p-4">
        <div className="rounded-full p-3 bg-blue-500">
          <Icon name="Users" size={20} className="text-white" />
        </div>
        <div>
          <TypographyMuted>Total Users</TypographyMuted>
          <TypographyH3>{users.length}</TypographyH3>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-card rounded-md p-4">
        <div className="rounded-full p-3 bg-green-500">
          <Icon name="CheckCircle2" size={20} className="text-white" />
        </div>
        <div>
          <TypographyMuted>Active Users</TypographyMuted>
          <TypographyH3>
            {users.filter((u) => u.status === "active").length}
          </TypographyH3>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-card rounded-md p-4">
        <div className="rounded-full p-3 bg-purple-500">
          <Icon name="IndianRupee" size={20} className="text-white" />
        </div>
        <div>
          <TypographyMuted>Paid Users</TypographyMuted>
          <TypographyH3>
            {users.filter((u) => u.plan !== "Free").length}
          </TypographyH3>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-card rounded-md p-4">
        <div className="rounded-full p-3 bg-green-500">
          <Icon name="IndianRupee" size={20} className="text-white" />
        </div>
        <div>
          <TypographyMuted>Total Revenue</TypographyMuted>
          <TypographyH3>
            ₹{users.reduce((sum, u) => sum + u.revenue, 0)}
          </TypographyH3>
        </div>
      </div>
    </div>
  );

  const FilterBox = () => (
    <Card className="md:p-3 rounded-none gap-0">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon
            name="Search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
          <SelectTrigger className="md:w-[180px] w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v)}>
          <SelectTrigger className="md:w-[180px] w-full">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );

  const UsersTable = () => (
    <Card>
      <TypographyH3>Users ({filteredUsers.length})</TypographyH3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <TypographyMuted>{user.email}</TypographyMuted>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getPlanBadge(user.plan)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>
                <p className="text-sm">{user.emailsSent} emails</p>
                <p className="text-xs text-muted-foreground">
                  Last: {user.lastActive}
                </p>
              </TableCell>
              <TableCell>₹{user.revenue}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Icon name="MoreHorizontal" size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(user)}>
                      <Icon name="Edit3" size={20} /> Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="Mail" size={20} /> Send Email
                    </DropdownMenuItem>

                    {user.status === "active" ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => suspendUser(user.id)}
                      >
                        <Icon name="Ban" className="text-red-600" size={20} />{" "}
                        Suspend
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => activateUser(user.id)}
                      >
                        <Icon name="CheckCircle2" size={20} /> Activate
                      </DropdownMenuItem>
                    )}

                    <AlertDialog
                      open={deleteUserId === user.id}
                      onOpenChange={() => setDeleteUserId(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => confirmDeleteUser(user.id)}
                        >
                          <Icon
                            name="Trash2"
                            className="text-red-600"
                            size={20}
                          />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.{" "}
                            <strong>{user.name}</strong> will be removed
                            permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  const UserDialog = () => (
    <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
      <DialogContent className="max-h-[75vh] overflow-y-auto">
        <div className="space-y-3">
          <TypographyH3>{isEditing ? "Edit User" : "Add User"}</TypographyH3>
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Select Plan</Label>
            <Select
              value={formData.plan}
              onValueChange={(v) => setFormData({ ...formData, plan: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSave}>
              {isEditing ? "Update User" : "Add User"}
            </Button>
            <Button variant="destructive" onClick={handleSave}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ==========================
  // Main render
  // ==========================
  return (
    <div className="space-y-6">
      <HeaderSection />
      <StatsSection />
      <FilterBox />
      <UsersTable />
      <UserDialog />
    </div>
  );
};

export default AdminUsers;
