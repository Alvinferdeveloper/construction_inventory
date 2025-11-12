import type * as React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import {
  Users,
  Warehouse,
  Package,
  LayoutDashboard,
  FileText,
  BarChart3,
  Truck,
  LogIn,
  LogOut,
  HelpCircle,
  ChevronRight,
} from "lucide-react"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

const configPorRol: {
  [key: string]: {
    headerBg: string
    sidebarBg: string
    mainBg: string
    accentColor: string
    menu: string[]
    iconos: { [key: string]: React.ReactNode }
  }
} = {
  ADMINISTRADOR: {
    headerBg: "bg-red-600",
    sidebarBg: "bg-gray-900",
    mainBg: "bg-gray-50",
    accentColor: "text-red-600",
    menu: ["Usuarios", "Bodegas", "Materiales", "Inventario", "Movimientos", "Reportes"],
    iconos: {
      Usuarios: <Users className="w-5 h-5" />,
      Bodegas: <Warehouse className="w-5 h-5" />,
      Materiales: <Package className="w-5 h-5" />,
      Inventario: <LayoutDashboard className="w-5 h-5" />,
      Movimientos: <Truck className="w-5 h-5" />,
      Reportes: <BarChart3 className="w-5 h-5" />,
      "Cerrar sesión": <LogOut className="w-5 h-5" />,
    },
  },
  BODEGUERO: {
    headerBg: "bg-blue-600",
    sidebarBg: "bg-slate-700",
    mainBg: "bg-blue-50",
    accentColor: "text-blue-600",
    menu: ["Entradas", "Salidas", "Inventario", "Requisas"],
    iconos: {
      Entradas: <LogIn className="w-5 h-5" />,
      Salidas: <LogOut className="w-5 h-5" />,
      Inventario: <Package className="w-5 h-5" />,
      Requisas: <FileText className="w-5 h-5" />,
      "Cerrar sesión": <LogOut className="w-5 h-5" />,
    },
  },
  SUPERVISOR: {
    headerBg: "bg-green-600",
    sidebarBg: "bg-white",
    mainBg: "bg-green-50",
    accentColor: "text-green-600",
    menu: ["Solicitar Materiales", "Estado de Requisas"],
    iconos: {
      "Solicitar Materiales": <FileText className="w-5 h-5" />,
      "Estado de Requisas": <BarChart3 className="w-5 h-5" />,
      "Cerrar sesión": <LogOut className="w-5 h-5" />,
    },
  },
  JEFE: {
    headerBg: "bg-cyan-600",
    sidebarBg: "bg-cyan-100",
    mainBg: "bg-cyan-50",
    accentColor: "text-cyan-600",
    menu: ["Bodegas", "Stock General", "Aprobaciones", "Reportes"],
    iconos: {
      Bodegas: <Warehouse className="w-5 h-5" />,
      "Stock General": <Package className="w-5 h-5" />,
      Aprobaciones: <BarChart3 className="w-5 h-5" />,
      Reportes: <BarChart3 className="w-5 h-5" />,
      "Cerrar sesión": <LogOut className="w-5 h-5" />,
    },
  },
}

function AvatarComponent({ name, bgColor }: { name: string; bgColor: string }) {
  return (
    <Avatar className={`${bgColor} w-10 h-10`}>
      <AvatarFallback className="font-bold text-white">{name[0]}</AvatarFallback>
    </Avatar>
  )
}

function SidebarItem({
  text,
  icon,
  isLast,
}: {
  text: string
  icon: React.ReactNode
  isLast?: boolean
}) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-opacity-10 hover:bg-black transition-colors group">
      <span className="text-foreground/70 group-hover:text-foreground">{icon}</span>
      <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground flex-1 text-left">
        {text}
      </span>
      <ChevronRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

const drawerWidth = 260

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const rol = "SUPERVISOR"
  const config = configPorRol[rol]

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen bg-background">
          <header className={`fixed top-0 left-0 right-0 ${config.headerBg} text-white z-50 shadow-lg`}>
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-xl font-bold tracking-tight">{rol} Panel</h1>
              <AvatarComponent name={rol} bgColor={config.headerBg} />
            </div>
          </header>

          <aside
            className={`fixed left-0 top-16 bottom-0 w-[${drawerWidth}px] ${config.sidebarBg} overflow-y-auto shadow-xl`}
            style={{ width: `${drawerWidth}px` }}
          >
            <nav className="p-4 space-y-1">
              {config.menu.map((item, index) => (
                <SidebarItem key={index} text={item} icon={config.iconos[item]} />
              ))}

              <Separator className="my-4 opacity-30" />

              <div className="px-4 py-3 flex items-center gap-2 text-sm font-medium text-foreground/60">
                <HelpCircle className="w-4 h-4" />
                <span>Soporte</span>
              </div>

              <SidebarItem text="Cerrar sesión" icon={config.iconos["Cerrar sesión"]} isLast />
            </nav>
          </aside>

          <main className={`${config.mainBg} flex-1 overflow-auto pt-16`} style={{ marginLeft: `${drawerWidth}px` }}>
            <div className="p-6 space-y-6">
              {/* Welcome Card */}
              <Card className="border-0 shadow-md bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className={`text-2xl font-bold ${config.accentColor}`}>Bienvenido, {rol}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 leading-relaxed">
                    Esta es tu interfaz personalizada. Usa el menú lateral para acceder a tus funciones clave.
                  </p>
                </CardContent>
              </Card>

              {/* Content Container */}
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
