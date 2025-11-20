import prisma from "@/app/lib/prisma"

export async function getAdminDashboardData() {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  
  const stats = await Promise.all([
    prisma.user.count({ where: { deletedAt: null, isActive: true } }),
    prisma.bodega.count({ where: { deletedAt: null, isActive: true } }),
    prisma.material.count({ where: { deletedAt: null } }),
    prisma.requisa.count({ where: { deletedAt: null, fecha: { gte: inicioMes } } })
  ])

  const requisas = await prisma.requisa.findMany({
    where: { deletedAt: null },
    include: { solicitante: true },
    orderBy: { fecha: 'desc' },
    take: 5
  })

  const materialesAgrupados = await prisma.detalleRequisa.groupBy({
    by: ['materialId'],
    _sum: { cantidad: true },
    where: {
      deletedAt: null,
      requisa: {
        deletedAt: null,
        fecha: { gte: inicioMes }
      }
    },
    orderBy: { _sum: { cantidad: 'desc' } },
    take: 5
  })

  const materialesMasSolicitados = await Promise.all(
    materialesAgrupados.map(async (item) => {
      const material = await prisma.material.findUnique({
        where: { id: item.materialId }
      })
      return {
        nombre: material?.nombre || 'Desconocido',
        cantidad: item._sum.cantidad || 0
      }
    })
  )

  return {
    stats: { totalUsuarios: stats[0], totalBodegas: stats[1], totalMateriales: stats[2], requisasDelMes: stats[3] },
    ultimasRequisas: requisas.map(r => ({
      id: `REQ-${r.id.toString().padStart(3, '0')}`,
      proyecto: r.proyecto,
      estado: r.estado,
      fecha: r.fecha.toISOString().split('T')[0]
    })),
    materialesMasSolicitados
  }
}

export async function getBodegueroDashboardData() {
  const inicioHoy = new Date(new Date().setHours(0, 0, 0, 0))
  
  const stats = await Promise.all([
    prisma.inventario.aggregate({ _sum: { stock_actual: true }, where: { deletedAt: null } }),
    prisma.requisa.count({ where: { deletedAt: null, estado: 'pendiente' } }),
    prisma.movimiento.count({ where: { deletedAt: null, fecha: { gte: inicioHoy } } })
  ])

  const stock = await prisma.inventario.findMany({
    where: { deletedAt: null },
    include: { material: true },
    take: 10
  })

  const requisas = await prisma.requisa.findMany({
    where: { deletedAt: null, estado: 'pendiente' },
    include: { solicitante: true, detalles: true },
    orderBy: { fecha: 'desc' },
    take: 5
  })

  return {
    stats: { materialesEnStock: stats[0]._sum.stock_actual || 0, requisasPendientes: stats[1], movimientosHoy: stats[2] },
    stockCritico: stock.map(s => ({
      material: s.material.nombre,
      stock: s.stock_actual,
      minimo: s.minStock,
      estado: s.stock_actual <= s.minStock ? 'critico' : 'bajo'
    })),
    requisasPendientes: requisas.map(r => ({
      id: `REQ-${r.id.toString().padStart(3, '0')}`,
      solicitante: r.solicitante.name,
      proyecto: r.proyecto,
      items: r.detalles.length,
      fecha: r.fecha.toISOString().split('T')[0]
    }))
  }
}

export async function getSupervisorDashboardData(userId: string) {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  
  const stats = await Promise.all([
    prisma.requisa.count({ where: { deletedAt: null, solicitanteId: userId, estado: 'pendiente' } }),
    prisma.requisa.count({ where: { deletedAt: null, solicitanteId: userId, estado: 'aprobada' } }),
    prisma.requisa.count({ where: { deletedAt: null, solicitanteId: userId, fecha: { gte: inicioMes } } })
  ])

  const requisas = await prisma.requisa.findMany({
    where: { deletedAt: null, solicitanteId: userId },
    include: { detalles: true },
    orderBy: { fecha: 'desc' },
    take: 8
  })

  return {
    stats: { requisasPendientes: stats[0], requisasAprobadas: stats[1], totalDelMes: stats[2] },
    misRequisas: requisas.map(r => ({
      id: `REQ-${r.id.toString().padStart(3, '0')}`,
      proyecto: r.proyecto,
      estado: r.estado,
      items: r.detalles.length,
      fecha: r.fecha.toISOString().split('T')[0]
    }))
  }
}

export async function getJefeDashboardData() {
  const inicioHoy = new Date(new Date().setHours(0, 0, 0, 0))
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  
  const stats = await Promise.all([
    prisma.requisa.count({ where: { deletedAt: null } }),
    prisma.requisa.count({ where: { deletedAt: null, estado: 'aprobada', fecha: { gte: inicioHoy } } }),
    prisma.requisa.count({ where: { deletedAt: null, estado: 'rechazada' } }),
    prisma.requisa.count({ where: { deletedAt: null, estado: 'en_proceso' } })
  ])

  const requisas = await prisma.requisa.findMany({
    where: { deletedAt: null, estado: 'pendiente' },
    include: { solicitante: true, detalles: true },
    orderBy: { fecha: 'desc' },
    take: 5
  })

  const materialesAgrupados = await prisma.detalleRequisa.groupBy({
    by: ['materialId'],
    _sum: { cantidad: true },
    where: {
      deletedAt: null,
      requisa: {
        deletedAt: null,
        fecha: { gte: inicioMes }
      }
    },
    orderBy: { _sum: { cantidad: 'desc' } },
    take: 5
  })

  const materialesMasSolicitados = await Promise.all(
    materialesAgrupados.map(async (item) => {
      const material = await prisma.material.findUnique({
        where: { id: item.materialId }
      })
      const proyectosCount = await prisma.requisa.count({
        where: {
          deletedAt: null,
          fecha: { gte: inicioMes },
          detalles: {
            some: {
              materialId: item.materialId,
              deletedAt: null
            }
          }
        }
      })
      return {
        nombre: material?.nombre || 'Desconocido',
        cantidad: item._sum.cantidad || 0,
        proyectos: proyectosCount
      }
    })
  )

  return {
    stats: { totalRequisas: stats[0], aprobadasHoy: stats[1], rechazadas: stats[2], enProceso: stats[3] },
    requisasPorAprobar: requisas.map(r => ({
      id: `REQ-${r.id.toString().padStart(3, '0')}`,
      solicitante: r.solicitante.name,
      proyecto: r.proyecto,
      items: r.detalles.length,
      fecha: r.fecha.toISOString().split('T')[0],
      prioridad: r.detalles.length > 10 ? 'alta' : 'media'
    })),
    materialesMasSolicitados
  }
}
