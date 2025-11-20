"use client"

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, Loader2 } from "lucide-react";
import { toggleUserStatus } from "@/app/lib/actions/users";

interface ToggleStatusButtonProps {
    userId: string;
    isActive: boolean;
}

export default function ToggleStatusButton({ userId, isActive }: ToggleStatusButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            toggleUserStatus(userId, isActive);
        });
    };

    const title = isActive ? "Desactivar usuario" : "Activar usuario";
    const Icon = isActive ? UserX : UserCheck;

    return (
        <Button
            variant="ghost"
            size="sm"
            className={`h-8 cursor-pointer w-8 p-0 ${isActive ? "hover:bg-red-100 hover:text-red-700" : "hover:bg-green-100 hover:text-green-700"} text-muted-foreground`}
            title={title}
            onClick={handleClick}
            disabled={isPending}
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
        </Button>
    );
}
