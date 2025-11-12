import {
  Users,
  Warehouse,
  Package,
  LayoutDashboard,
  FileText,
  BarChart3,
  Truck,
  LogOut,
} from "lucide-react"
export const configByRole: {
  [key: string]: {
    headerBg: string
    sidebarBg: string
    mainBg: string
    accentColor: string
    menu: {
      name: string
      href: string
    }[]
    iconos: { [key: string]: React.ReactNode }
  }
} = {
  ADMINISTRADOR: {
    headerBg: "bg-red-600",
    sidebarBg: "bg-gray-900",
    mainBg: "bg-gray-50",
    accentColor: "text-red-600",
    menu: [{
      name: "Usuarios",
      href: "/usuarios",
    }, {
      name: "Bodegas",
      href: "/bodegas",
    }, {
      name: "Materiales",
      href: "/materiales",
    }, {
      name: "Inventario",
      href: "/inventario",
    }, {
      name: "Movimientos",
      href: "/movimientos",
    }, {
      name: "Reportes",
      href: "/reportes",
    }],
    iconos: {
      Usuarios: <Users size={20} />,
      Bodegas: <Warehouse size={20} />,
      Materiales: <Package size={20} />,
      Inventario: <LayoutDashboard size={20} />,
      Movimientos: <Truck size={20} />,
      Reportes: <FileText size={20} />,
      "Cerrar sesión": <LogOut size={20} />,
    },
  },
  BODEGUERO: {
    headerBg: "bg-blue-600",
    sidebarBg: "bg-slate-700",
    mainBg: "bg-blue-50",
    accentColor: "text-blue-600",
    menu: [{
      name: "Entradas",
      href: "/entradas",
    }, {
      name: "Salidas",
      href: "/salidas",
    }, {
      name: "Inventario",
      href: "/inventario",
    }, {
      name: "Requisas",
      href: "/requisas",
    }],
    iconos: {
      Entradas: <Truck size={20} />,
      Salidas: <Package size={20} />,
      Inventario: <LayoutDashboard size={20} />,
      Requisas: <FileText size={20} />,
      "Cerrar sesión": <LogOut size={20} />,
    },
  },
  SUPERVISOR: {
    headerBg: "bg-green-600",
    sidebarBg: "bg-white",
    mainBg: "bg-green-50",
    accentColor: "text-green-600",
    menu: [{
      name: "Solicitar Materiales",
      href: "/solicitar-materiales",
    }, {
      name: "Estado de Requisas",
      href: "/estado-de-requisas",
    }],
    iconos: {
      "Solicitar Materiales": <Package size={20} />,
      "Estado de Requisas": <FileText size={20} />,
      "Cerrar sesión": <LogOut size={20} />,
    },
  },
  JEFE: {
    headerBg: "bg-cyan-600",
    sidebarBg: "bg-cyan-100",
    mainBg: "bg-cyan-50",
    accentColor: "text-cyan-600",
    menu: [{
      name: "Bodegas",
      href: "/bodegas",
    }, {
      name: "Stock General",
      href: "/stock-general",
    }, {
      name: "Aprobaciones",
      href: "/aprobaciones",
    }, {
      name: "Reportes",
      href: "/reportes",
    }],
    iconos: {
      Bodegas: <Warehouse size={20} />,
      "Stock General": <BarChart3 size={20} />,
      Aprobaciones: <FileText size={20} />,
      Reportes: <FileText size={20} />,
      "Cerrar sesión": <LogOut size={20} />,
    },
  },
}