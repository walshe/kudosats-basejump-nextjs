"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  employeeName: string;
  description: string;
  amount: number;
  timeAgo: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  title?: string;
  description?: string;
  onViewAll?: () => void;
}

// Mock data for now - would come from actual API
const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    employeeName: "Sarah Johnson",
    description: "Closed 5 support tickets",
    amount: 5000,
    timeAgo: "2 hours ago"
  },
  {
    id: "2",
    employeeName: "Mike Chen", 
    description: "Deployed new feature",
    amount: 10000,
    timeAgo: "5 hours ago"
  },
  {
    id: "3",
    employeeName: "Emily Rodriguez",
    description: "Perfect customer rating",
    amount: 3000,
    timeAgo: "1 day ago"
  }
];

export default function RecentActivityCard({ 
  activities = defaultActivities,
  title = "Recent Reward Activity",
  description = "Latest rewards sent to team members",
  onViewAll
}: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.employeeName}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">+{activity.amount.toLocaleString()} sats</p>
                <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
        {onViewAll && (
          <Button variant="outline" className="w-full mt-4" onClick={onViewAll}>
            View All Activity
          </Button>
        )}
      </CardContent>
    </Card>
  );
}