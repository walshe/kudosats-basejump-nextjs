import { Shield, Users, BarChart3, User, Award, Wallet } from "lucide-react";

export const getOwnerNavigation = (accountSlug: string) => [
  // Admin Section
  { 
    name: "Admin Dashboard", 
    href: `/dashboard/${accountSlug}`,
    icon: <Shield className="h-4 w-4" />,
    variant: 'admin' as const,
    section: 'Company Management'
  },
  { 
    name: "Team Management", 
    href: `/dashboard/${accountSlug}/owner-menu-b`,
    icon: <Users className="h-4 w-4" />,
    variant: 'admin' as const,
    section: 'Company Management'
  },
  { 
    name: "Analytics & Reports", 
    href: `/dashboard/${accountSlug}/owner-menu-c`,
    icon: <BarChart3 className="h-4 w-4" />,
    variant: 'admin' as const,
    section: 'Company Management'
  },
  // Personal Employee Section
  { 
    name: "My Personal Dashboard", 
    href: `/dashboard/${accountSlug}/employee-view`,
    icon: <User className="h-4 w-4" />,
    variant: 'personal' as const,
    section: 'Personal Rewards'
  },
  { 
    name: "My Personal Rewards", 
    href: `/dashboard/${accountSlug}/member-menu-b`,
    icon: <Award className="h-4 w-4" />,
    variant: 'personal' as const,
    section: 'Personal Rewards'
  },
  { 
    name: "My Personal Wallet", 
    href: `/dashboard/${accountSlug}/member-menu-c`,
    icon: <Wallet className="h-4 w-4" />,
    variant: 'personal' as const,
    section: 'Personal Rewards'
  },
];

export const getMemberNavigation = (accountSlug: string) => [
  { 
    name: "My Dashboard", 
    href: `/dashboard/${accountSlug}`,
    icon: <User className="h-4 w-4" />,
    variant: 'default' as const
  },
  { 
    name: "My Rewards History", 
    href: `/dashboard/${accountSlug}/member-menu-b`,
    icon: <Award className="h-4 w-4" />,
    variant: 'default' as const
  },
  { 
    name: "Wallet & Settings", 
    href: `/dashboard/${accountSlug}/member-menu-c`,
    icon: <Wallet className="h-4 w-4" />,
    variant: 'default' as const
  },
];