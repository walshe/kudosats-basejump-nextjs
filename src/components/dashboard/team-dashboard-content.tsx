"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Send } from "lucide-react";
import SendRewardDialog from "@/components/rewards/send-reward-dialog";
import TeamWalletCard from "@/components/rewards/team-wallet-card";
import EmployeeWalletCard from "@/components/rewards/employee-wallet-card";
import RecentActivityCard from "@/components/rewards/recent-activity-card";
import TopPerformersCard from "@/components/rewards/top-performers-card";
import RecentRewardsCard from "@/components/rewards/recent-rewards-card";

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
        {/* ADMIN SECTION */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Team Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage your team wallet, send rewards, and track team performance.
            </p>
          </div>

          {/* Admin Controls */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TeamWalletCard balance={245680} />
            
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
                <CardTitle className="text-sm font-medium">Send Reward</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setSendRewardOpen(true)}>
                  <Send className="h-3 w-3 mr-1" />
                  Send Reward
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Instant Lightning payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Performance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                This Month's Performance
              </CardTitle>
              <CardDescription>
                Team rewards activity and growth metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">84,230 sats</div>
                  <p className="text-xs text-muted-foreground">Total rewards sent</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">47</div>
                  <p className="text-xs text-muted-foreground">Rewards distributed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">+23%</div>
                  <p className="text-xs text-muted-foreground">Growth vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <RecentActivityCard onViewAll={() => console.log('View all activity')} />
          <TopPerformersCard />
        </div>


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

      <EmployeeWalletCard 
        balance={15680}
        monthlyRewards={8250}
        monthlyCount={5}
        isTopPerformer={true}
        rank={3}
      />

      <RecentRewardsCard />
    </>
  );
}