"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";

interface CompanyWalletCardProps {
  balance: number;
  onAddFunds?: () => void;
}

export default function CompanyWalletCard({ balance, onAddFunds }: CompanyWalletCardProps) {
  const balanceEur = (balance * 0.0004).toFixed(2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Company Wallet</CardTitle>
        <Wallet className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance.toLocaleString()} sats</div>
        <p className="text-xs text-muted-foreground">≈ €{balanceEur} • For funding rewards</p>
        <Button size="sm" className="mt-2 w-full" onClick={onAddFunds}>
          <Plus className="h-3 w-3 mr-1" />
          Add Funds
        </Button>
      </CardContent>
    </Card>
  );
}