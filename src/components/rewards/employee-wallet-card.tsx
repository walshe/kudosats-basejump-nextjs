"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

interface EmployeeWalletCardProps {
  balance: number;
  monthlyRewards: number;
  monthlyCount: number;
  isTopPerformer?: boolean;
  rank?: number;
}

export default function EmployeeWalletCard({ 
  balance, 
  monthlyRewards, 
  monthlyCount, 
  isTopPerformer = false,
  rank 
}: EmployeeWalletCardProps) {
  const balanceEur = (balance * 0.0004).toFixed(2);
  const monthlyEur = (monthlyRewards * 0.0004).toFixed(2);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-500" />
            My Total Rewards
          </CardTitle>
          <CardDescription>
            Lightning Network rewards earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balance.toLocaleString()} sats</div>
          <p className="text-xs text-muted-foreground">≈ €{balanceEur}</p>
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
          <div className="text-2xl font-bold">{monthlyRewards.toLocaleString()} sats</div>
          <p className="text-xs text-muted-foreground">{monthlyCount} rewards received</p>
          <p className="text-xs text-muted-foreground">≈ €{monthlyEur}</p>
          <div className="mt-2 flex gap-2">
            {isTopPerformer && (
              <Badge className="bg-green-100 text-green-800">
                {rank ? `Top ${rank} performer` : 'Top performer'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}