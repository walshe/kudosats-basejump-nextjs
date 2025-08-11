import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {createClient} from "@/lib/supabase/server";
import { getOwnerNavigation, getMemberNavigation } from "@/lib/navigation";

export default async function MemberMenuCPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
    const supabaseClient = createClient();
    const {data: teamAccount} = await supabaseClient.rpc('get_account_by_slug', {
        slug: accountSlug
    });

    const isOwner = teamAccount?.account_role === 'owner';
    const navigationItems = isOwner ? getOwnerNavigation(accountSlug) : getMemberNavigation(accountSlug);
    
    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle title={isOwner ? "My Personal Wallet" : "Wallet & Settings"} description="Manage your personal Lightning wallet and account preferences." />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={navigationItems} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Wallet & Settings</h3>
                            <p className="text-sm text-muted-foreground">
                                Configure your Lightning wallet and account preferences.
                            </p>
                        </div>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lightning Wallet Settings</CardTitle>
                                    <CardDescription>
                                        Configure your external Lightning wallet for withdrawals.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Lightning Address</label>
                                            <input 
                                                type="text" 
                                                placeholder="you@getalby.com" 
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Where your rewards will be sent when you withdraw
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Minimum Withdrawal</label>
                                            <input 
                                                type="number" 
                                                placeholder="10000" 
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Minimum sats before auto-withdrawal (optional)
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>
                                        Choose how you want to be notified about rewards.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Get notified when you receive rewards</p>
                                            </div>
                                            <input type="checkbox" className="h-4 w-4" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Achievement Badges</p>
                                                <p className="text-sm text-muted-foreground">Celebrate milestone achievements</p>
                                            </div>
                                            <input type="checkbox" className="h-4 w-4" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Monthly Summary</p>
                                                <p className="text-sm text-muted-foreground">Monthly reward summary email</p>
                                            </div>
                                            <input type="checkbox" className="h-4 w-4" defaultChecked />
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