import {
  Users,
  Warehouse,
  Package,
  LayoutDashboard,
  FileText,
  BarChart3,
  Truck,
  Database,
  Home,
} from "lucide-react"
export const menuByRole: {
  [key: string]: {
    menu: {
      name: string
      href: string
      icon: React.ReactNode
    }[]
  }
} = {
  ADMINISTRADOR: {
    menu: [{
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: <Home size={20} />,
    }, {
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
      href: "/movimientos",
      icon: <Truck size={20} />,
    }, {
      name: "Reportes",
      href: "/reportes",
      icon: <FileText size={20} />,
    },{
      name: "Restauracion",
      href:"/backup",
      icon: <Database size={20}/>,
    }],
  },
  BODEGUERO: {
    menu: [{
      name: "Dashboard",
      href: "/dashboard/bodeguero",
      icon: <Home size={20} />,
    }, {
      name: "Entradas",
      href: "/entradas",
      icon: <Truck size={20} />,
    }, {
      name: "Salidas",
      href: "/salidas",
      icon: <Package size={20} />,
    }, {
      name: "Inventario",
      href: "/inventario",
      icon: <LayoutDashboard size={20} />,
    }, {
      name: "Solicitudes de Material",
      href: "/bodega/asignaciones",
      icon: <FileText size={20} />,
    }],
  },
  SUPERVISOR: {
    menu: [{
      name: "Dashboard",
      href: "/dashboard/supervisor",
      icon: <Home size={20} />,
    }, {
      name: "Solicitar Materiales",
      href: "/requisas",
      icon: <Package size={20} />,
    }, {
      name: "Estado de Requisas",
      href: "/estado-de-requisas",
      icon: <FileText size={20} />,
    }],
  },
  JEFE: {
    menu: [{
      name: "Dashboard",
      href: "/dashboard/jefe",
      icon: <Home size={20} />,
    }, {
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