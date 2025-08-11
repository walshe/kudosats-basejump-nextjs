import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import {createClient} from "@/lib/supabase/server";
import TeamDashboardContent from "@/components/dashboard/team-dashboard-content";
import { getOwnerNavigation } from "@/lib/navigation";

export default async function EmployeeViewPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
    const supabaseClient = createClient();
    const {data: teamAccount} = await supabaseClient.rpc('get_account_by_slug', {
        slug: accountSlug
    });

    // Force employee view even for owners
    const employeeViewAccount = {
        ...teamAccount,
        account_role: 'member' // This makes the TeamDashboardContent render as employee
    };

    const ownerItems = getOwnerNavigation(accountSlug);

    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle 
                title="My Personal Dashboard" 
                description="View your personal rewards and team activity as an employee." 
            />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={ownerItems} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <TeamDashboardContent 
                            teamAccount={employeeViewAccount} 
                            accountSlug={accountSlug} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}