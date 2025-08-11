import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import {createClient} from "@/lib/supabase/server";
import TeamDashboardContent from "@/components/dashboard/team-dashboard-content";

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
                        <TeamDashboardContent teamAccount={teamAccount} accountSlug={accountSlug} />
                    </div>
                </div>
            </div>
        </div>
    )
}