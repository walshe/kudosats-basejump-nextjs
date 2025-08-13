import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {createClient} from "@/lib/supabase/server";
import { Alert } from "@/components/ui/alert";
import { getOwnerNavigation } from "@/lib/navigation";

export default async function OwnerMenuBPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
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

    const ownerItems = getOwnerNavigation(accountSlug);
    
    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle title="Team Management Dashboard" description="Manage your team and employee rewards system." />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={ownerItems} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Team Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage employees, reward categories, and team settings.
                            </p>
                        </div>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Employee Management</CardTitle>
                                    <CardDescription>
                                        Manage team members, roles, and wallet setup.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 border rounded">
                                            <div>
                                                <p className="font-medium">Sarah Johnson</p>
                                                <p className="text-sm text-muted-foreground">Customer Support • 28,750 sats earned</p>
                                            </div>
                                            <Badge variant="outline">Active</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border rounded">
                                            <div>
                                                <p className="font-medium">Mike Chen</p>
                                                <p className="text-sm text-muted-foreground">Developer • 32,500 sats earned</p>
                                            </div>
                                            <Badge variant="outline">Active</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border rounded">
                                            <div>
                                                <p className="font-medium">Emily Rodriguez</p>
                                                <p className="text-sm text-muted-foreground">Sales • 24,100 sats earned</p>
                                            </div>
                                            <Badge variant="outline">Active</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Reward Categories</CardTitle>
                                    <CardDescription>
                                        Configure reward types and spending limits.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 border rounded">
                                            <div>
                                                <p className="font-medium">Performance Excellence</p>
                                                <p className="text-sm text-muted-foreground">Max: 10,000 sats</p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border rounded">
                                            <div>
                                                <p className="font-medium">Great Teamwork</p>
                                                <p className="text-sm text-muted-foreground">Max: 5,000 sats</p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border rounded">
                                            <div>
                                                <p className="font-medium">Customer Service</p>
                                                <p className="text-sm text-muted-foreground">Max: 7,500 sats</p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}