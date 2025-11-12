import { PrismaClient, MovimientoTipo, RequisaEstado } from '@prisma/client';
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"
import type { auth } from "../app/lib/auth";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
})

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const rolAdmin = await prisma.rol.create({
    data: { nombre: 'administrador', descripcion: 'Acceso total al sistema' },
  });
  const rolBodeguero = await prisma.rol.create({
    data: { nombre: 'bodeguero', descripcion: 'Gestión de inventario y bodegas' },
  });
  const rolSupervisor = await prisma.rol.create({
    data: { nombre: 'supervisor', descripcion: 'Supervisa proyectos y requisas' },
  });
  const rolJefe = await prisma.rol.create({
    data: { nombre: 'jefe', descripcion: 'Jefe de obra o proyecto' },
  });
  console.log('Roles created');

  const usersToCreate = [
    { email: 'admin@example.com', name: 'Admin User', rolId: rolAdmin.id },
    { email: 'bodeguero@example.com', name: 'Bodeguero User', rolId: rolBodeguero.id },
    { email: 'supervisor@example.com', name: 'Supervisor User', rolId: rolSupervisor.id },
    { email: 'jefe@example.com', name: 'Jefe User', rolId: rolJefe.id },
  ];

  for (const userData of usersToCreate) {
    await authClient.signUp.email({
      email: userData.email,
      name: userData.name,
      password: 'password123',
      phone: '123456789',
      direction: '123 Main St',
      identification: '123456789',
      estado: true,
      rolId: userData.rolId,
    });
    const user = await prisma.user.findUnique({ where: { email: userData.email } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { rolId: userData.rolId, emailVerified: true },
      });
    }
  }
  console.log('Users created');

  const userBodeguero = await prisma.user.findFirst({ where: { rolId: rolBodeguero.id } });
  const userSupervisor = await prisma.user.findFirst({ where: { rolId: rolSupervisor.id } });

  if (!userBodeguero || !userSupervisor) {
    throw new Error('Could not find users for seeding');
  }

  const catHerramientas = await prisma.categoria.create({
    data: { nombre: 'Herramientas' },
  });
  const catMateriales = await prisma.categoria.create({
    data: { nombre: 'Materiales de Construcción' },
  });
  console.log('Categories created');

  const materialMartillo = await prisma.material.create({
    data: {
      nombre: 'Martillo de uña',
      unidad_medida: 'unidad',
      categoriaId: catHerramientas.id,
    },
  });
  const materialCemento = await prisma.material.create({
    data: {
      nombre: 'Cemento Portland',
      unidad_medida: 'saco',
      categoriaId: catMateriales.id,
    },
  });
  console.log('Materials created');

  const bodegaPrincipal = await prisma.bodega.create({
    data: {
      nombre: 'Bodega Principal',
      ubicacion: 'Zona Central',
      responsableId: userBodeguero.id,
    },
  });
  console.log('Warehouses created');

  const inventarioMartillo = await prisma.inventario.create({
    data: {
      bodegaId: bodegaPrincipal.id,
      materialId: materialMartillo.id,
      stock_actual: 100,
    },
  });
  const inventarioCemento = await prisma.inventario.create({
    data: {
      bodegaId: bodegaPrincipal.id,
      materialId: materialCemento.id,
      stock_actual: 200,
    },
  });
  console.log('Inventory created');

  await prisma.movimiento.create({
    data: {
      inventarioId: inventarioMartillo.id,
      tipo: MovimientoTipo.entrada,
      cantidad: 100,
      usuarioId: userBodeguero.id,
      observaciones: 'Stock inicial',
    },
  });
  await prisma.movimiento.create({
    data: {
      inventarioId: inventarioCemento.id,
      tipo: MovimientoTipo.entrada,
      cantidad: 200,
      usuarioId: userBodeguero.id,
      observaciones: 'Stock inicial',
    },
  });
  console.log('Movements created');

  await prisma.requisa.create({
    data: {
      proyecto: 'Construcción Edificio A',
      solicitanteId: userSupervisor.id,
      estado: RequisaEstado.pendiente,
      destino: 'Frente de obra 1',
      detalles: {
        create: [
          {
            materialId: materialMartillo.id,
            cantidad: 5,
            descripcion: 'Para carpintería',
          },
          {
            materialId: materialCemento.id,
            cantidad: 20,
            descripcion: 'Para cimientos',
          },
        ],
      },
    },
  });
  console.log('Requisitions created');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });