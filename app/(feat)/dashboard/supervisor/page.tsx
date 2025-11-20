import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, Calendar, Plus, Check, Clock, X, RefreshCw, CheckCheck } from "lucide-react"
import { getSupervisorDashboardData } from "@/app/lib/dashboard"
import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"

export default async function SupervisorDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  const data = await getSupervisorDashboardData(session?.user.id || '')

  const stats = [
    { title: "Mis Requisas Pendientes", value: data.stats.requisasPendientes.toString(), icon: FileText, color: "text-orange-600" },
    { title: "Mis Requisas Aprobadas", value: data.stats.requisasAprobadas.toString(), icon: CheckCircle, color: "text-green-600" },
    { title: "Total Solicitado Este Mes", value: data.stats.totalDelMes.toString(), icon: Calendar, color: "text-blue-600" }
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobada": return "text-green-600 bg-green-100"
      case "pendiente": return "text-yellow-600 bg-yellow-100"
      case "rechazada": return "text-red-600 bg-red-100"
      case "en_proceso": return "text-blue-600 bg-blue-100"
      case "completada": return "text-gray-600 bg-gray-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "aprobada": return Check
      case "pendiente": return Clock
      case "rechazada": return X
      case "en_proceso": return RefreshCw
      case "completada": return CheckCheck
      default: return FileText
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Supervisor</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Nueva Requisa
        </button>
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

      <Card>
        <CardHeader>
          <CardTitle>Mis Últimas Requisas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.misRequisas.map((requisa) => {
              const IconComponent = getEstadoIcon(requisa.estado)
              return (
              <div key={requisa.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <IconComponent className="h-6 w-6" />
                  <div>
                    <p className="font-medium text-lg">{requisa.id}</p>
                    <p className="text-sm text-gray-600">{requisa.proyecto}</p>
                    <p className="text-xs text-gray-500">{requisa.items} materiales • {requisa.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(requisa.estado)}`}>
                    {requisa.estado}
                  </span>
                </div>
              </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
