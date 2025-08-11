import SettingsNavigation from "@/components/dashboard/settings-navigation";
import DashboardTitle from "@/components/dashboard/dashboard-title";
import {Separator} from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuCPage({params: {accountSlug}}: {params: {accountSlug: string}}) {
    const items = [
        { name: "Menu A", href: `/dashboard/${accountSlug}` },
        { name: "Menu B", href: `/dashboard/${accountSlug}/menu-b` },
        { name: "Menu C", href: `/dashboard/${accountSlug}/menu-c` },
    ]
    
    return (
        <div className="hidden space-y-6 pb-16 md:block">
            <DashboardTitle title="Team Dashboard" description="Manage your team and employee rewards." />
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full max-w-6xl mx-auto">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNavigation items={items} />
                </aside>
                <div className="grow">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Menu C</h3>
                            <p className="text-sm text-muted-foreground">
                                This is Menu C section of the team dashboard.
                            </p>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Menu C Content</CardTitle>
                                <CardDescription>
                                    Placeholder content for Menu C functionality.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Team dashboard content for Menu C will go here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}