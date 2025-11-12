"use client"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
export function SidebarItem({
    text,
    icon,
    isLast,
    href
}: {
    text: string
    icon: React.ReactNode
    isLast?: boolean
    href?: string
}) {
    const pathname = usePathname()
    const isActive = pathname === href
    return (
        <>
            <Link href={href || "#"}>
                <button
                    className={`flex items-center cursor-pointer gap-3 px-4 py-3 w-full text-left transition-colors ${isActive ? "bg-gray-200 text-gray-900 font-semibold" : "hover:bg-gray-100"
                        }`}
                >
                    {icon}
                    <span className="flex-1">{text}</span>
                </button>
            </Link>
            {!isLast && <Separator />}
        </>
    )
}
