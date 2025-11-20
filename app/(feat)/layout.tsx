import type * as React from "react"
import { Separator } from "@/components/ui/separator"
import { menuByRole } from "@/app/(feat)/config/rol"
import { SidebarItem } from "@/app/(feat)/components/SideBarItem"
import { HelpCircle } from "lucide-react"
import { AvatarComponent } from "@/app/(feat)/components/Avatar"
import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import SignOutButton from "@/app/(feat)/components/SignOutButton"
import { Toaster } from "sonner"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/login')
  }

  const { menu } = menuByRole[session.user.rol]

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[260px] bg-gray-50 overflow-y-auto shadow-xl`}
      >
        <div className="flex items-center gap-4 p-4">
          <AvatarComponent name={session?.user.name} bgColor="bg-red-600" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-foreground">{session?.user.rol}</p>
            <p className="text-sm text-foreground/60">{session?.user.name}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menu.map((item, index) => (
            <SidebarItem key={index} text={item.name} icon={item.icon} href={item.href} isLast={index === menu.length - 1} subItems={item.subItems} />
          ))}

          <Separator className="my-4" />

          <div className="flex bottom-8 fixed w-[230px] flex-col gap-2">
            <div className="px-4 py-3 flex items-center gap-2 text-sm font-medium text-foreground/60">
              <HelpCircle className="w-4 h-4" />
              <span>Soporte</span>
            </div>
            <SignOutButton />
          </div>
        </nav>
      </aside>

      <main className={`bg-green-50 flex-1 overflow-auto ml-[260px]`}>
        <div className="p-6 space-y-6">
          {children}
        </div>
        <Toaster />
      </main>
    </div>
  )
}
