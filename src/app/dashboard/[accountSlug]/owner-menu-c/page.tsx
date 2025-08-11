import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {createClient} from "@/lib/supabase/server";
import { Alert } from "@/components/ui/alert";

export default async function OwnerMenuCPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
    const supabaseClient = createClient();
    const {data: teamAccount} = await supabaseClient.rpc('get_account_by_slug', {
        slug: accountSlug
    });

    // Only allow owners to access this page
    if (teamAccount?.account_role !== 'owner') {
        return (
            <Alert variant="destructive">You do not have permission to access this page</Alert>
        )
    }

    const ownerItems = [
        // Admin Section
        { name: "Admin Dashboard", href: `/dashboard/${accountSlug}` },
        { name: "Team Management", href: `/dashboard/${accountSlug}/owner-menu-b` },
        { name: "Analytics & Reports", href: `/dashboard/${accountSlug}/owner-menu-c` },
        // Personal Employee Section
        { name: "My Personal Dashboard", href: `/dashboard/${accountSlug}/employee-view` },
        { name: "My Personal Rewards", href: `/dashboard/${accountSlug}/member-menu-b` },
        { name: "My Personal Wallet", href: `/dashboard/${accountSlug}/member-menu-c` },
    ];
    
    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle title="Analytics & Reports" description="Performance insights and detailed reward analytics." />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={ownerItems} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Analytics & Reports</h3>
                            <p className="text-sm text-muted-foreground">
                                Detailed insights into team performance and reward distribution.
                            </p>
                        </div>
                        
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Spending Analytics</CardTitle>
                                    <CardDescription>
                                        Track reward spending patterns and budget utilization.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">128,430 sats</div>
                                            <p className="text-xs text-muted-foreground">Total spent (3 months)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">84,230 sats</div>
                                            <p className="text-xs text-muted-foreground">This month</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">€51.37</div>
                                            <p className="text-xs text-muted-foreground">Monthly avg (EUR)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">23%</div>
                                            <p className="text-xs text-muted-foreground">Growth rate</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Reward Categories Breakdown</CardTitle>
                                        <CardDescription>Distribution by category type</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span>Performance Excellence</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                                                    </div>
                                                    <span className="text-sm">65%</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Customer Service</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                                                    </div>
                                                    <span className="text-sm">25%</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Great Teamwork</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '10%'}}></div>
                                                    </div>
                                                    <span className="text-sm">10%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Monthly Trends</CardTitle>
                                        <CardDescription>Reward activity over time</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm">January 2024</span>
                                                <span className="font-medium">68,400 sats</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">February 2024</span>
                                                <span className="font-medium">75,800 sats</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">March 2024</span>
                                                <span className="font-medium">84,230 sats</span>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>Average Growth</span>
                                                    <span className="text-green-600">+11.5%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}