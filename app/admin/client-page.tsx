'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { updateUserRole, resetGenerationCount, updateSubscriptionRenewalDay } from '@/app/actions/admin';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface User {
  id: string;
  email: string;
  role: string;
  generation_count: number;
  created_at: string;
  last_24h_count: number;
  subscription_renewal_day?: number;
}

interface Generation {
  id: string;
  created_at: string;
  style: string;
  room_type: string;
  generated_image: string; // JSON string of URLs
  original_image: string;
  user_email: string;
}

interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalGenerations: number;
  };
  users: User[];
  generations: Generation[];
  generationStats: any[];
}

export default function AdminDashboardClient({
  stats,
  users: initialUsers,
  generations,
  generationStats,
}: AdminDashboardProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGen, setSelectedGen] = useState<Generation | null>(null);

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleResetCount = async (userId: string) => {
    try {
      await resetGenerationCount(userId);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, generation_count: 0 } : user
        )
      );
      toast.success('Generation count reset successfully');
    } catch (error) {
      toast.error('Failed to reset generation count');
    }
  };

  const handleRenewalUpdate = async (userId: string, day: string) => {
    const dayNum = parseInt(day);
    // If empty or invalid, try to clear it or ignore
    if (!day) return;

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
        toast.error('Day must be between 1 and 31');
        return;
    }

    try {
      await updateSubscriptionRenewalDay(userId, dayNum);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, subscription_renewal_day: dayNum } : user
        )
      );
      toast.success('Renewal day updated');
    } catch (error) {
      toast.error('Failed to update renewal day');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Process data for charts
  const processChartData = () => {
    const dailyGenerations: Record<string, number> = {};
    const styles: Record<string, number> = {};
    const rooms: Record<string, number> = {};

    generationStats.forEach((gen) => {
      const date = new Date(gen.created_at).toLocaleDateString();
      dailyGenerations[date] = (dailyGenerations[date] || 0) + 1;

      if (gen.style) styles[gen.style] = (styles[gen.style] || 0) + 1;
      if (gen.room_type) rooms[gen.room_type] = (rooms[gen.room_type] || 0) + 1;
    });

    const dailyData = Object.entries(dailyGenerations)
      .map(([date, count]) => ({ date, count }))
      .slice(-7); // Last 7 days

    const styleData = Object.entries(styles).map(([name, value]) => ({
      name,
      value,
    }));
    const roomData = Object.entries(rooms).map(([name, value]) => ({
      name,
      value,
    }));

    return { dailyData, styleData, roomData };
  };

  const { dailyData, styleData, roomData } = processChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Helper to get all images from JSON string
  const getImages = (jsonImages: string) => {
    try {
      const images = JSON.parse(jsonImages);
      return Array.isArray(images) ? images : [];
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="generations">Generations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalGenerations}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Generations (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Users</CardTitle>
                <CardDescription>
                  Users with the most generations (Last 24h & Total).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">24h</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .sort((a, b) => b.last_24h_count - a.last_24h_count || b.generation_count - a.generation_count)
                      .slice(0, 5)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium truncate max-w-[150px]" title={user.email}>
                            {user.email}
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                             {user.last_24h_count > 0 ? `+${user.last_24h_count}` : '-'}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">{user.generation_count}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader>
                    <CardTitle className="text-blue-900">Role Limits Legend</CardTitle>
                    <CardDescription className="text-blue-700">
                        Reference for user role generation limits.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                            <span className="text-sm font-semibold text-gray-500 uppercase">General</span>
                            <span className="text-2xl font-bold text-gray-900">3</span>
                            <span className="text-xs text-gray-400">generations</span>
                        </div>
                        <div className="flex flex-col p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                            <span className="text-sm font-semibold text-gray-500 uppercase">Trial</span>
                            <span className="text-2xl font-bold text-gray-900">100</span>
                            <span className="text-xs text-gray-400">generations</span>
                        </div>
                        <div className="flex flex-col p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                            <span className="text-sm font-semibold text-blue-600 uppercase">Paid</span>
                            <span className="text-2xl font-bold text-blue-900">Unlimited</span>
                            <span className="text-xs text-blue-400">generations</span>
                        </div>
                        <div className="flex flex-col p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                            <span className="text-sm font-semibold text-purple-600 uppercase">Admin</span>
                            <span className="text-2xl font-bold text-purple-900">Unlimited</span>
                            <span className="text-xs text-purple-400">generations</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, update roles, and view usage.
              </CardDescription>
              <div className="flex items-center py-4">
                <Input
                  placeholder="Filter emails..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Generations</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Renewal</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) =>
                            handleRoleUpdate(user.id, value)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{user.generation_count}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.role === 'paid' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">Renews every:</span>
                                <div className="flex items-center">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={31}
                                        className="w-16 h-8 text-xs text-center"
                                        // Use user's saved day, or default to 20 for primacasa if unset, or empty
                                        defaultValue={
                                            user.subscription_renewal_day ||
                                            (user.email === 'primacasa@rinovaai.com' ? 20 : '')
                                        }
                                        placeholder="Day"
                                        onBlur={(e) => {
                                            const val = e.target.value;
                                            if (val && parseInt(val) !== user.subscription_renewal_day) {
                                                handleRenewalUpdate(user.id, val);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value;
                                                if (val) handleRenewalUpdate(user.id, val);
                                                e.currentTarget.blur();
                                            }
                                        }}
                                    />
                                    <span className="text-xs text-muted-foreground ml-1">of the month</span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetCount(user.id)}
                        >
                          Reset Count
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Generations</CardTitle>
              <CardDescription>
                View the most recent generations across all users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Image</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generations.map((gen) => (
                    <TableRow key={gen.id}>
                      <TableCell>
                        {new Date(gen.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">
                        {gen.user_email}
                      </TableCell>
                      <TableCell>{gen.style}</TableCell>
                      <TableCell>{gen.room_type}</TableCell>
                      <TableCell>
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedGen(gen)}
                         >
                            View Images ({getImages(gen.generated_image).length})
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedGen} onOpenChange={(open) => !open && setSelectedGen(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generation Details</DialogTitle>
            <DialogDescription>
                Created on {selectedGen && new Date(selectedGen.created_at).toLocaleString()} by {selectedGen?.user_email}
            </DialogDescription>
          </DialogHeader>

          {selectedGen && (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Original Image</h3>
                    <div className="rounded-lg overflow-hidden border bg-muted/20">
                        <img
                            src={selectedGen.original_image}
                            alt="Original"
                            className="w-full h-auto object-contain max-h-[500px]"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Generated Images</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {getImages(selectedGen.generated_image).map((img: string, idx: number) => (
                            <div key={idx} className="rounded-lg overflow-hidden border bg-muted/20 relative group">
                                <img
                                    src={img}
                                    alt={`Generated ${idx + 1}`}
                                    className="w-full h-auto object-cover aspect-square"
                                />
                                <a
                                    href={img}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity"
                                >
                                    Open Full
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
