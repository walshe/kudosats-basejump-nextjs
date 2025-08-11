"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RewardActivity {
  id: string;
  description: string;
  fromPerson: string;
  amount: number;
  timeAgo: string;
}

interface RecentRewardsCardProps {
  rewards: RewardActivity[];
  title?: string;
  description?: string;
  showViewAll?: boolean;
}

// Mock data for now - would come from actual API
const defaultRewards: RewardActivity[] = [
  {
    id: "1",
    description: "Excellent customer service",
    fromPerson: "Manager",
    amount: 5000,
    timeAgo: "2 days ago"
  },
  {
    id: "2", 
    description: "Code review contribution",
    fromPerson: "Tech Lead",
    amount: 3250,
    timeAgo: "5 days ago"
  }
];

export default function RecentRewardsCard({ 
  rewards = defaultRewards,
  title = "Recent Rewards",
  description = "Your latest achievements and recognition",
  showViewAll = false
}: RecentRewardsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rewards.map((reward) => (
            <div key={reward.id} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{reward.description}</p>
                <p className="text-xs text-muted-foreground">From: {reward.fromPerson}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">+{reward.amount.toLocaleString()} sats</p>
                <p className="text-xs text-muted-foreground">{reward.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
        {showViewAll && (
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800">
            View All Rewards
          </button>
        )}
      </CardContent>
    </Card>
  );
}