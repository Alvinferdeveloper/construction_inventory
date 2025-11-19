"use server";

import prisma from "@/app/lib/prisma";
import type { Prisma } from "@prisma/client";
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export type RequisaWithDetails = Prisma.RequisaGetPayload<{
  include: {
    detalles: {
      include: {
        material: true;
        bodega: true;
      };
    };
    solicitante: {
      select: {
        name: true;
      };
    };
  };
}>;

export async function getRequisasForSupervisor(): Promise<RequisaWithDetails[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return [];
  }
  const supervisorId = session.user.id;

  try {
    const requisas = await prisma.requisa.findMany({
      where: {
        solicitanteId: supervisorId,
        deletedAt: null,
      },
      include: {
        detalles: {
          include: {
            material: true,
            bodega: true,
          },
        },
        solicitante: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
    return requisas;
  } catch (error) {
    return [];
  }
}

export async function getMaterialesWithStock() {
  try {
    const materiales = await prisma.material.findMany({
      where: { deletedAt: null },
      include: {
        inventario: {
          select: {
            stock_actual: true,
          },
        },
      },
    });

    const materialesConStock = materiales.map((material) => {
      const stockTotal = material.inventario.reduce(
        (acc, inv) => acc + inv.stock_actual,
        0
      );
      const { inventario, ...rest } = material;
      return {
        ...rest,
        stockTotal,
      };
    });

    return materialesConStock;
  } catch (error) {
    return [];
  }
}

export type DetalleRequisaForBodeguero = Prisma.DetalleRequisaGetPayload<{
  include: {
    requisa: {
      include: {
        solicitante: {
          select: { name: true }
        }
      }
    },
    material: true,
    bodega: true
  }
}>;

export async function getRequisaById(id: number): Promise<RequisaWithDetails | null> {
  try {
    const requisa = await prisma.requisa.findUnique({
      where: { id: id, deletedAt: null },
      include: {
        detalles: {
          include: {
            material: true,
            bodega: true,
          },
          orderBy: { materialId: 'asc' },
        },
        solicitante: {
          select: {
            name: true,
          },
        },
      },
    });
    return requisa;
  } catch (error) {
    return null;
  }
}

export async function getDetallesForBodeguero(): Promise<DetalleRequisaForBodeguero[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return [];
  }
  const bodegueroId = session.user.id;

  try {
    
    const bodegasResponsable = await prisma.bodega.findMany({
      where: { responsableId: bodegueroId },
      select: { id: true },
    });

    if (bodegasResponsable.length === 0) {
      return [];
    }

    const bodegaIds = bodegasResponsable.map(b => b.id);

  
    const detalles = await prisma.detalleRequisa.findMany({
      where: {
        bodegaId: { in: bodegaIds },
        estado: 'pendiente' 
      },
      include: {
        requisa: {
          include: {
            solicitante: { select: { name: true } }
          }
        },
        material: true,
        bodega: true
      },
      orderBy: {
        requisa: { fecha: 'desc' }
      }
    });

    return detalles;

  } catch (error) {
    return [];
  }
}
