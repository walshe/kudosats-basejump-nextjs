"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Users, TrendingUp, Activity, Plus, Send } from "lucide-react";
import SendRewardDialog from "@/components/rewards/send-reward-dialog";

interface TeamAccount {
  account_id: string;
  account_role: string;
  name: string;
  personal_account: boolean;
}

interface TeamDashboardContentProps {
  teamAccount: TeamAccount;
  accountSlug: string;
}

export default function TeamDashboardContent({ teamAccount, accountSlug }: TeamDashboardContentProps) {
  const [sendRewardOpen, setSendRewardOpen] = useState(false);
  const isOwner = teamAccount?.account_role === 'owner';

  if (isOwner) {
    return (
      <>
        <div>
          <h3 className="text-lg font-medium">Company Wallet & Rewards Overview</h3>
          <p className="text-sm text-muted-foreground">
            Manage your team's Lightning Network wallet and employee rewards.
          </p>
        </div>

        {/* Wallet Balance & Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245,680 sats</div>
              <p className="text-xs text-muted-foreground">≈ €98.27</p>
              <Button size="sm" className="mt-2 w-full">
                <Plus className="h-3 w-3 mr-1" />
                Add Funds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
              <Badge variant="secondary" className="mt-2">3 pending invites</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84,230 sats</div>
              <p className="text-xs text-muted-foreground">47 rewards sent</p>
              <p className="text-xs text-green-600">+23% vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setSendRewardOpen(true)}>
                <Send className="h-3 w-3 mr-1" />
                Send Reward
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Instant employee rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Reward Activity
            </CardTitle>
            <CardDescription>
              Latest rewards sent to team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Closed 5 support tickets</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">+5,000 sats</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mike Chen</p>
                  <p className="text-sm text-muted-foreground">Deployed new feature</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">+10,000 sats</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Emily Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Perfect customer rating</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">+3,000 sats</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers This Month</CardTitle>
            <CardDescription>
              Employees with the highest rewards earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">1</Badge>
                  <span className="font-medium">Mike Chen</span>
                </div>
                <span className="text-sm">32,500 sats</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">2</Badge>
                  <span className="font-medium">Sarah Johnson</span>
                </div>
                <span className="text-sm">28,750 sats</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">3</Badge>
                  <span className="font-medium">Emily Rodriguez</span>
                </div>
                <span className="text-sm">24,100 sats</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <SendRewardDialog 
          open={sendRewardOpen} 
          onOpenChange={setSendRewardOpen}
          accountSlug={accountSlug}
        />
      </>
    );
  }

  // Employee Dashboard
  return (
    <>
      <div>
        <h3 className="text-lg font-medium">My Rewards Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Track your earned rewards and team activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Total Rewards</CardTitle>
            <CardDescription>
              Lightning Network rewards earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,680 sats</div>
            <p className="text-xs text-muted-foreground">≈ €6.27</p>
            <Button size="sm" className="mt-2">
              Withdraw to Wallet
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
            <CardDescription>
              Recent achievements and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,250 sats</div>
            <p className="text-xs text-muted-foreground">5 rewards received</p>
            <Badge className="mt-2">Top 3 performer</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Rewards</CardTitle>
          <CardDescription>
            Your latest achievements and recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Excellent customer service</p>
                <p className="text-xs text-muted-foreground">From: Manager</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">+5,000 sats</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Code review contribution</p>
                <p className="text-xs text-muted-foreground">From: Tech Lead</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">+3,250 sats</p>
                <p className="text-xs text-muted-foreground">5 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}