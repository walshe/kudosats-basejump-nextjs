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
        { name: "Owner Menu A", href: `/dashboard/${accountSlug}` },
        { name: "Owner Menu B", href: `/dashboard/${accountSlug}/owner-menu-b` },
        { name: "Owner Menu C", href: `/dashboard/${accountSlug}/owner-menu-c` },
    ];
    
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
                            <h3 className="text-lg font-medium">Owner Menu C</h3>
                            <p className="text-sm text-muted-foreground">
                                Analytics, reporting, and system administration.
                            </p>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>System Analytics & Reports</CardTitle>
                                <CardDescription>
                                    View team performance metrics, reward distribution analytics, and generate reports.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Analytics and reporting tools for owners will go here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}