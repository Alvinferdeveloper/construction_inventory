"use client"
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export interface SubItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

export function SidebarItem({
    text,
    icon,
    isLast,
    href,
    subItems
}: {
    text: string;
    icon: React.ReactNode;
    isLast?: boolean;
    href?: string;
    subItems?: SubItem[];
}) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const hasSubItems = subItems && subItems.length > 0;
    const isActive = !hasSubItems && pathname === href;
    const isSubItemActive = hasSubItems && subItems.some(item => pathname === item.href);

    const handleToggle = () => {
        if (hasSubItems) {
            setIsOpen(!isOpen);
        }
    };


    const mainContent = (
        <div
            className={`flex items-center cursor-pointer gap-3 px-4 py-3 w-full text-left transition-colors ${isActive || (isSubItemActive && !hasSubItems) ? "bg-gray-200 text-gray-900 font-semibold" : "hover:bg-gray-100"}`}
        >
            {icon}
            <span className="flex-1">{text}</span>
            {hasSubItems && (
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            )}
        </div>
    );

    return (
        <>
            {hasSubItems ? (
                <button onClick={handleToggle} className="w-full">
                    {mainContent}
                </button>
            ) : (
                <Link href={href || "#"}>
                    {mainContent}
                </Link>
            )}

            {hasSubItems && isOpen && (
                <div className="pl-8 space-y-1 py-2 bg-gray-50">
                    {subItems.map((item, index) => {
                        const isSubActive = pathname === item.href;
                        return (
                            <Link key={index} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-2 w-full text-left rounded-md transition-colors text-sm ${isSubActive ? "bg-gray-200 text-gray-900 font-semibold" : "hover:bg-gray-100 text-gray-600"}`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
            {!isLast && <Separator />}
        </>
    );
}

