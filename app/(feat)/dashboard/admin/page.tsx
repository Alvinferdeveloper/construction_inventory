import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Warehouse, FileText, Package } from "lucide-react"
import { getAdminDashboardData } from "@/app/lib/dashboard"

export default async function AdminDashboard() {
  const data = await getAdminDashboardData()

  const stats = [
    { title: "Total Usuarios", value: data.stats.totalUsuarios.toString(), icon: Users, color: "text-blue-600" },
    { title: "Total Bodegas", value: data.stats.totalBodegas.toString(), icon: Warehouse, color: "text-green-600" },
    { title: "Requisas del Mes", value: data.stats.requisasDelMes.toString(), icon: FileText, color: "text-orange-600" },
    { title: "Materiales Registrados", value: data.stats.totalMateriales.toString(), icon: Package, color: "text-purple-600" }
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobada": return "text-green-600 bg-green-100"
      case "pendiente": return "text-yellow-600 bg-yellow-100"
      case "rechazada": return "text-red-600 bg-red-100"
      case "en_proceso": return "text-blue-600 bg-blue-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Requisas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.ultimasRequisas.map((requisa) => (
                <div key={requisa.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{requisa.id}</p>
                    <p className="text-sm text-gray-600">{requisa.proyecto}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(requisa.estado)}`}>
                      {requisa.estado}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{requisa.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materiales Más Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.materialesMasSolicitados.length > 0 ? (
                data.materialesMasSolicitados.map((material, index) => {
                  const maxCantidad = data.materialesMasSolicitados[0]?.cantidad || 1
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium text-sm">{material.nombre}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(material.cantidad / maxCantidad) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{material.cantidad}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No hay datos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
