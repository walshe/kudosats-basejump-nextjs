import {createClient} from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { redirect } from "next/navigation";

export default async function PersonalAccountDashboard({children, params: {accountSlug}}: {children: React.ReactNode, params: {accountSlug: string}}) {
    const supabaseClient = createClient();

    const {data: teamAccount, error} = await supabaseClient.rpc('get_account_by_slug', {
        slug: accountSlug
    });

    if (!teamAccount) {
        redirect('/dashboard');
    }

    // Check if user is owner of this team
    const { data: roleData, error: roleError } = await supabaseClient.rpc('current_user_account_role', {
        account_id: teamAccount.account_id
    });
    
    const accountRole = roleData?.account_role;

    // Only show navigation if user is owner of THIS specific team
    const navigation = accountRole === 'owner' ? [
        {
            name: 'Overview',
            href: `/dashboard/${accountSlug}`,
        },
        {
            name: 'Settings',
            href: `/dashboard/${accountSlug}/settings`
        }
    ] : [];

    return (
        <>
            <DashboardHeader accountId={teamAccount.account_id} navigation={navigation}/>
            <div className="w-full p-8">{children}</div>
        </>
    )

}