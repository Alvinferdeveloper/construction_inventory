"use server";

export async function distributeMaterials(
  tx: any,
  requisaId: number,
  materiales: { materialId: number; cantidad: number }[]
) {
  for (const material of materiales) {
    let cantidadNecesaria = material.cantidad;

    const inventarios = await tx.inventario.findMany({
      where: {
        materialId: material.materialId,
        stock_actual: { gt: 0 },
      },
      orderBy: {
        stock_actual: 'desc',
      },
    });

    if (
      inventarios.reduce(
        (acc: number, inv: { stock_actual: number }) => acc + inv.stock_actual,
        0
      ) < cantidadNecesaria
    ) {
      throw new Error(`Stock insuficiente para el material ID: ${material.materialId}.`);
    }

    for (const inventario of inventarios) {
      if (cantidadNecesaria <= 0) break;

      const cantidadADescontar = Math.min(cantidadNecesaria, inventario.stock_actual);

      await tx.detalleRequisa.create({
        data: {
          requisaId,
          materialId: material.materialId,
          bodegaId: inventario.bodegaId,
          cantidad: cantidadADescontar,
        },
      });

      cantidadNecesaria -= cantidadADescontar;
    }
  }
}
