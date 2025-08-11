import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {createClient} from "@/lib/supabase/server";

export default async function MemberMenuBPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
    const supabaseClient = createClient();
    const {data: teamAccount} = await supabaseClient.rpc('get_account_by_slug', {
        slug: accountSlug
    });

    const memberItems = [
        { name: "Member Menu A", href: `/dashboard/${accountSlug}` },
        { name: "Member Menu B", href: `/dashboard/${accountSlug}/member-menu-b` },
        { name: "Member Menu C", href: `/dashboard/${accountSlug}/member-menu-c` },
    ];
    
    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle title="Employee Dashboard" description="View your rewards and team activity." />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={memberItems} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Member Menu B</h3>
                            <p className="text-sm text-muted-foreground">
                                Track your achievements and reward history.
                            </p>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>My Achievements & History</CardTitle>
                                <CardDescription>
                                    View your earned rewards, transaction history, and achievements over time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Employee achievements and reward history will go here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}