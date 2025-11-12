import type * as React from "react"
import { Separator } from "@/components/ui/separator"
import { configByRole } from "@/app/(feat)/config/rol"
import { SidebarItem } from "@/app/(feat)/components/SideBarItem"
import { HelpCircle } from "lucide-react"
import { AvatarComponent } from "@/app/(feat)/components/Avatar"
import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/login')
  }

  const config = configByRole[session.user.rol]

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[260px] ${config.sidebarBg} overflow-y-auto shadow-xl`}
      >
        <div className="flex items-center gap-4 p-4">
          <AvatarComponent name={session?.user.name} bgColor="bg-red-600" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-foreground">{session?.user.rol}</p>
            <p className="text-sm text-foreground/60">{session?.user.name}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {config.menu.map((item, index) => (
            <SidebarItem key={index} text={item.name} icon={config.iconos[item.name]} href={item.href} isLast={index === config.menu.length - 1} />
          ))}

          <Separator className="my-4" />

          <div className="px-4 py-3 flex items-center gap-2 text-sm font-medium text-foreground/60">
            <HelpCircle className="w-4 h-4" />
            <span>Soporte</span>
          </div>

          <SidebarItem text="Cerrar sesión" icon={config.iconos["Cerrar sesión"]} isLast />
        </nav>
      </aside>

      <main className={`${config.mainBg} flex-1 overflow-auto ml-[260px]`}>
        <div className="p-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
