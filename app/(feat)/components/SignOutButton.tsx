"use client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { redirect } from "next/navigation"
import { authClient } from "@/app/lib/auth-client"
export default function SignOutButton() {
    const handleSignOut = async () => {
        authClient.signOut()
        redirect('/login')
    }
    return (
        <Button
            className={`flex bg-red-500/70 items-center cursor-pointer gap-3 px-4 py-3 w-full text-left transition-colors hover:bg-red-500/50`}
            onClick={handleSignOut}
        >
            <LogOut size={20} />
            <span className="flex-1">Cerrar sesión</span>
        </Button>
    )
}