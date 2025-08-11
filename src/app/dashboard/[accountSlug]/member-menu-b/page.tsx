import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {createClient} from "@/lib/supabase/server";
import { getOwnerNavigation, getMemberNavigation } from "@/lib/navigation";

export default async function MemberMenuBPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
    const supabaseClient = createClient();
    const {data: teamAccount} = await supabaseClient.rpc('get_account_by_slug', {
        slug: accountSlug
    });

    const isOwner = teamAccount?.account_role === 'owner';
    const navigationItems = isOwner ? getOwnerNavigation(accountSlug) : getMemberNavigation(accountSlug);
    
    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle title={isOwner ? "My Personal Rewards" : "My Rewards History"} description="Track your achievement history and earned rewards." />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={navigationItems} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">My Rewards History</h3>
                            <p className="text-sm text-muted-foreground">
                                Detailed view of all your earned rewards and achievements.
                            </p>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>All Time Rewards</CardTitle>
                                <CardDescription>
                                    Complete history of your Lightning Network rewards.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Excellent customer service</p>
                                            <p className="text-sm text-muted-foreground">From: Manager • March 15, 2024</p>
                                            <p className="text-xs text-muted-foreground">Category: Customer Service</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">+5,000 sats</p>
                                            <p className="text-xs text-muted-foreground">≈ €2.00</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Code review contribution</p>
                                            <p className="text-sm text-muted-foreground">From: Tech Lead • March 10, 2024</p>
                                            <p className="text-xs text-muted-foreground">Category: Performance Excellence</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">+3,250 sats</p>
                                            <p className="text-xs text-muted-foreground">≈ €1.30</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Project milestone completion</p>
                                            <p className="text-sm text-muted-foreground">From: Project Manager • March 5, 2024</p>
                                            <p className="text-xs text-muted-foreground">Category: Performance Excellence</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">+7,500 sats</p>
                                            <p className="text-xs text-muted-foreground">≈ €3.00</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}