import prisma from "@/app/lib/prisma"

export async function getMateriales() {
  try {
    const materiales = await prisma.material.findMany({
      where: {
        deletedAt: null
      },
      include: {
        categoria: true
      },
      orderBy: {
        id: 'desc'
      }
    })
    return materiales
  } catch (error) {
    console.error("Error al obtener materiales:", error)
    return []
  }
}

export async function getMaterialById(id: number) {
  try {
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        categoria: true
      }
    })
    return material
  } catch (error) {
    console.error("Error al obtener material:", error)
    return null
  }
}

export async function getCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nombre: 'asc'
      }
    })
    return categorias
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return []
  }
}

export async function getUnassignedMaterials(bodegaId: number) {
  const assignedMaterialIds = await prisma.inventario.findMany({
    where: {
      bodegaId: bodegaId,
      deletedAt: null,
    },
    select: {
      materialId: true,
    },
  });

  const idsToExclude = assignedMaterialIds.map(item => item.materialId);

  const unassignedMaterials = await prisma.material.findMany({
    where: {
      id: {
        notIn: idsToExclude,
      },
      deletedAt: null,
    },
    select: {
      id: true,
      nombre: true,
    },
    orderBy: {
      nombre: 'asc',
    }
  });

  return unassignedMaterials;
}