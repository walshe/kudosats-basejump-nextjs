"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface NavItem {
    href: string
    name: string
    icon?: React.ReactNode
    variant?: 'admin' | 'personal' | 'default'
    section?: string
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: NavItem[]
}

export default function SettingsNavigation({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname()

    // Group items by section if they have one
    const groupedItems = items.reduce((acc, item) => {
        const section = item.section || 'default'
        if (!acc[section]) acc[section] = []
        acc[section].push(item)
        return acc
    }, {} as Record<string, NavItem[]>)

    const getItemStyles = (item: NavItem, isActive: boolean) => {
        const baseStyles = buttonVariants({ variant: "ghost" })
        
        let variantStyles = ""
        if (item.variant === 'admin') {
            variantStyles = isActive 
                ? "bg-blue-100 text-blue-800 border-l-2 border-blue-600 hover:bg-blue-100" 
                : "text-blue-700 hover:bg-blue-50 hover:text-blue-800 border-l-2 border-transparent hover:border-blue-300"
        } else if (item.variant === 'personal') {
            variantStyles = isActive 
                ? "bg-green-100 text-green-800 border-l-2 border-green-600 hover:bg-green-100" 
                : "text-green-700 hover:bg-green-50 hover:text-green-800 border-l-2 border-transparent hover:border-green-300"
        } else {
            variantStyles = isActive 
                ? "bg-muted hover:bg-muted" 
                : "hover:bg-transparent hover:underline"
        }

        return cn(baseStyles, variantStyles, "justify-start")
    }

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            {Object.entries(groupedItems).map(([section, sectionItems], sectionIndex) => (
                <div key={section}>
                    {sectionIndex > 0 && <Separator className="my-3" />}
                    {section !== 'default' && (
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {section}
                        </div>
                    )}
                    {sectionItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={getItemStyles(item, pathname === item.href)}
                        >
                            <div className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ))}
        </nav>
    )
}
