import {
  Users,
  Warehouse,
  Package,
  LayoutDashboard,
  FileText,
  BarChart3,
  Truck,
  Database,
  LogIn,
  LogOut,
  History,
  Boxes,
} from "lucide-react"

export const menuByRole: {
  [key: string]: {
    menu: {
      name: string
      href?: string // href is optional for dropdowns
      icon: React.ReactNode
      subItems?: {
        name: string
        href: string
        icon: React.ReactNode
      }[]
    }[]
  }
} = {
  ADMINISTRADOR: {
    menu: [{
      name: "Usuarios",
      href: "/usuarios",
      icon: <Users size={20} />,
    }, {
      name: "Bodegas",
      href: "/bodegas",
      icon: <Warehouse size={20} />,
    }, {
      name: "Materiales",
      href: "/materiales",
      icon: <Package size={20} />,
    }, {
      name: "Inventario",
      href: "/inventario",
      icon: <LayoutDashboard size={20} />,
    }, {
      name: "Movimientos",
      icon: <Truck size={20} />,
      subItems: [
        { name: "Entradas", href: "/entradas", icon: <LogIn size={16} /> },
        { name: "Salidas", href: "/salidas", icon: <LogOut size={16} /> }
      ]
    }, {
      name: "Reportes",
      href: "/reportes",
      icon: <FileText size={20} />,
    }, {
      name: "Restauracion",
      href: "/backup",
      icon: <Database size={20} />,
    }],
  },
  BODEGUERO: {
    menu: [{
      name: "Movimientos",
      icon: <Truck size={20} />,
      subItems: [
        { name: "Entradas", href: "/entradas", icon: <LogIn size={16} /> },
        { name: "Salidas", href: "/salidas", icon: <LogOut size={16} /> }
      ]
    }, {
      name: "Inventario",
      href: "/inventario",
      icon: <LayoutDashboard size={20} />,
    }, {
      name: "Solicitudes de Material",
      href: "/bodega/asignaciones",
      icon: <FileText size={20} />,
    }, {
      name: "Reportes",
      href: "/reportes",
      icon: <FileText size={20} />,
    }],
  },
  SUPERVISOR: {
    menu: [{
      name: "Solicitar Materiales",
      href: "/requisas",
      icon: <Package size={20} />,
    }, {
      name: "Estado de Requisas",
      href: "/estado-de-requisas",
      icon: <FileText size={20} />,
    }, {
      name: "Historial de Recibidos",
      href: "/historial-materiales",
      icon: <History size={20} />,
    }, {
      name: "Disponibilidad",
      href: "/disponibilidad",
      icon: <Boxes size={20} />,
    }, {
      name: "Reportes",
      href: "/reportes",
      icon: <FileText size={20} />,
    }],
  },
  JEFE: {
    menu: [{
      name: "Bodegas",
      href: "/bodegas",
      icon: <Warehouse size={20} />,
    }, {
      name: "Stock General",
      href: "/stock-general",
      icon: <BarChart3 size={20} />,
    }, {
      name: "Aprobaciones",
      href: "/aprobaciones",
      icon: <FileText size={20} />,
    }, {
      name: "Reportes",
      href: "/reportes",
      icon: <FileText size={20} />,
    }],
  },
}