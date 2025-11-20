import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react"
import { getJefeDashboardData } from "@/app/lib/dashboard"

export default async function JefeDashboard() {
  const data = await getJefeDashboardData()

  const stats = [
    { title: "Requisas Totales", value: data.stats.totalRequisas.toString(), icon: FileText, color: "text-blue-600" },
    { title: "Aprobadas Hoy", value: data.stats.aprobadasHoy.toString(), icon: CheckCircle, color: "text-green-600" },
    { title: "Rechazadas", value: data.stats.rechazadas.toString(), icon: XCircle, color: "text-red-600" },
    { title: "En Proceso", value: data.stats.enProceso.toString(), icon: Clock, color: "text-orange-600" }
  ]

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta": return "text-red-600 bg-red-100"
      case "media": return "text-yellow-600 bg-yellow-100"
      case "baja": return "text-green-600 bg-green-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
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
            <CardTitle>Requisas Por Aprobar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.requisasPorAprobar.map((requisa) => (
                <div key={requisa.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-lg">{requisa.id}</p>
                      <p className="text-sm text-gray-600">{requisa.solicitante}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(requisa.prioridad)}`}>
                      {requisa.prioridad}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{requisa.proyecto}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{requisa.items} materiales • {requisa.fecha}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                      Aprobar
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors">
                      Rechazar
                    </button>
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
            <div className="space-y-4">
              {data.materialesMasSolicitados.length > 0 ? (
                data.materialesMasSolicitados.map((material, index) => {
                  const maxCantidad = data.materialesMasSolicitados[0]?.cantidad || 1
                  return (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{material.nombre}</span>
                        <span className="text-lg font-bold text-blue-600">{material.cantidad}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Usado en {material.proyectos} proyectos</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(material.cantidad / maxCantidad) * 100}%` }}
                          ></div>
                        </div>
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
