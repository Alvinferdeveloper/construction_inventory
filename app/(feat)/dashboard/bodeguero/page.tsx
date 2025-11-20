import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileText, TrendingUp, AlertTriangle } from "lucide-react"
import { getBodegueroDashboardData } from "@/app/lib/dashboard"

export default async function BodegueroDashboard() {
  const data = await getBodegueroDashboardData()

  const stats = [
    { title: "Materiales en Stock", value: data.stats.materialesEnStock.toLocaleString(), icon: Package, color: "text-green-600" },
    { title: "Requisas Pendientes", value: data.stats.requisasPendientes.toString(), icon: FileText, color: "text-orange-600" },
    { title: "Movimientos Hoy", value: data.stats.movimientosHoy.toString(), icon: TrendingUp, color: "text-blue-600" }
  ]

  const getStockColor = (estado: string) => {
    switch (estado) {
      case "critico": return "text-red-600 bg-red-100"
      case "bajo": return "text-yellow-600 bg-yellow-100"
      case "normal": return "text-green-600 bg-green-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getStockIcon = (estado: string) => {
    return estado === "critico" || estado === "bajo" ? AlertTriangle : Package
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Bodeguero</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Stock de Materiales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.stockCritico.map((item, index) => {
                const Icon = getStockIcon(item.estado)
                return (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${item.estado === 'critico' ? 'text-red-500' : item.estado === 'bajo' ? 'text-yellow-500' : 'text-green-500'}`} />
                      <span className="font-medium text-sm">{item.material}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockColor(item.estado)}`}>
                        {item.stock} / {item.minimo}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requisas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.requisasPendientes.map((requisa) => (
                <div key={requisa.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{requisa.id}</p>
                    <p className="text-sm text-gray-600">{requisa.solicitante}</p>
                    <p className="text-xs text-gray-500">{requisa.proyecto}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {requisa.items} items
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{requisa.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
