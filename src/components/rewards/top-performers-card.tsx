"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Performer {
  id: string;
  name: string;
  amount: number;
  rank: number;
}

interface TopPerformersCardProps {
  performers: Performer[];
  title?: string;
  description?: string;
}

// Mock data for now - would come from actual API
const defaultPerformers: Performer[] = [
  { id: "1", name: "Mike Chen", amount: 32500, rank: 1 },
  { id: "2", name: "Sarah Johnson", amount: 28750, rank: 2 },
  { id: "3", name: "Emily Rodriguez", amount: 24100, rank: 3 }
];

export default function TopPerformersCard({ 
  performers = defaultPerformers,
  title = "Top Performers This Month",
  description = "Employees with the highest rewards earned"
}: TopPerformersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performers.map((performer) => (
            <div key={performer.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{performer.rank}</Badge>
                <span className="font-medium">{performer.name}</span>
              </div>
              <span className="text-sm">{performer.amount.toLocaleString()} sats</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}