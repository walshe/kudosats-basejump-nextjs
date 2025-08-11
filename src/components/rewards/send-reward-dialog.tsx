"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Zap } from "lucide-react";

interface SendRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountSlug: string;
}

// Mock data - would come from actual team members query
const mockEmployees = [
  { id: "1", name: "Sarah Johnson", role: "Customer Support" },
  { id: "2", name: "Mike Chen", role: "Software Developer" },
  { id: "3", name: "Emily Rodriguez", role: "Sales Rep" },
  { id: "4", name: "David Kim", role: "Designer" },
  { id: "5", name: "Lisa Wang", role: "Marketing Manager" },
];

// Mock reward categories - would come from database
const mockCategories = [
  { id: "performance", name: "Performance Excellence" },
  { id: "teamwork", name: "Great Teamwork" },
  { id: "innovation", name: "Innovation & Creativity" },
  { id: "customer", name: "Customer Service" },
  { id: "milestone", name: "Milestone Achievement" },
  { id: "peer", name: "Peer Recognition" },
];

export default function SendRewardDialog({ open, onOpenChange, accountSlug }: SendRewardDialogProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReward = async () => {
    if (!selectedEmployee || !amount || !category) {
      return;
    }

    setIsLoading(true);
    
    // Mock API call - would integrate with LNbits and database
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here would be actual implementation:
    // 1. Call edge function to send Lightning payment
    // 2. Record reward in database
    // 3. Update wallet balances
    // 4. Send notification to employee
    
    setIsLoading(false);
    onOpenChange(false);
    
    // Reset form
    setSelectedEmployee("");
    setAmount("");
    setCategory("");
    setMessage("");
    
    // Show success message
    alert("Reward sent successfully!");
  };

  const selectedEmployeeName = mockEmployees.find(e => e.id === selectedEmployee)?.name;
  const estimatedEur = amount ? (parseInt(amount) * 0.0004).toFixed(2) : "0.00"; // 1 sat ≈ €0.0004

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Send Lightning Reward
          </DialogTitle>
          <DialogDescription>
            Send instant sats rewards to recognize employee achievements.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose team member..." />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex flex-col">
                      <span>{employee.name}</span>
                      <span className="text-xs text-muted-foreground">{employee.role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Reward Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">sats</span>
            </div>
            {amount && (
              <p className="text-xs text-muted-foreground">≈ €{estimatedEur}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Reward Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Why are you rewarding them?" />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Great job on the project delivery!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Preview */}
          {selectedEmployee && amount && category && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <p className="text-sm text-muted-foreground">
                Send <strong>{amount} sats</strong> to <strong>{selectedEmployeeName}</strong> for{" "}
                <strong>{mockCategories.find(c => c.id === category)?.name}</strong>
                {message && (
                  <>
                    <br />
                    Message: "{message}"
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendReward}
            disabled={!selectedEmployee || !amount || !category || isLoading}
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Reward
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}