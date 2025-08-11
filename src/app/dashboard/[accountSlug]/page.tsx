import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {createClient} from "@/lib/supabase/server";

export default async function TeamAccountPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
    const supabaseClient = createClient();
    const {data: teamAccount} = await supabaseClient.rpc('get_account_by_slug', {
        slug: accountSlug
    });

    // Define different menus for owners vs members
    const ownerItems = [
        { name: "Owner Menu A", href: `/dashboard/${accountSlug}` },
        { name: "Owner Menu B", href: `/dashboard/${accountSlug}/owner-menu-b` },
        { name: "Owner Menu C", href: `/dashboard/${accountSlug}/owner-menu-c` },
    ];

    const memberItems = [
        { name: "Member Menu A", href: `/dashboard/${accountSlug}` },
        { name: "Member Menu B", href: `/dashboard/${accountSlug}/member-menu-b` },
        { name: "Member Menu C", href: `/dashboard/${accountSlug}/member-menu-c` },
    ];

    const isOwner = teamAccount?.account_role === 'owner';
    const items = isOwner ? ownerItems : memberItems;
    
    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle 
                title={isOwner ? "Team Management Dashboard" : "Employee Dashboard"} 
                description={isOwner ? "Manage your team and employee rewards system." : "View your rewards and team activity."} 
            />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={items} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">
                                {isOwner ? "Owner Menu A" : "Member Menu A"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {isOwner 
                                    ? "Manage your team's rewards and settings." 
                                    : "View your personal rewards and activity."
                                }
                            </p>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {isOwner ? "Team Management Overview" : "My Rewards Overview"}
                                </CardTitle>
                                <CardDescription>
                                    {isOwner 
                                        ? "Quick overview of your team and rewards management tools."
                                        : "Your personal rewards, achievements, and team activity."
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    {isOwner 
                                        ? "Team management dashboard content for owners will go here."
                                        : "Employee dashboard content for members will go here."
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}