import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import {UserIcon} from "lucide-react";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export default async function UserAccountButton() {
    const supabaseClient = createClient();
    const {data: personalAccount} = await supabaseClient.rpc('get_personal_account');

    const signOut = async () => {
        'use server'

        const supabase = createClient()
        await supabase.auth.signOut()
        return redirect('/')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                    <UserIcon className="text-white" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2 p-2">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">⚡</span>
                            <span className="text-xs text-muted-foreground font-medium">Logged in as</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-semibold leading-none text-gray-900">{personalAccount.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {personalAccount.email}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span>🏠</span>
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600">
                <form action={signOut} className="w-full">
                    <button className="w-full text-left flex items-center gap-2">
                        <span>🚪</span>
                        <span>Log out</span>
                    </button>
                </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
