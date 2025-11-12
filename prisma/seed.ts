
import { PrismaClient, MovimientoTipo, RequisaEstado } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      rolId: rolAdmin.id,
      emailVerified: true,
    },
  });

  const userBodeguero = await prisma.user.create({
    data: {
      name: 'Bodeguero User',
      email: 'bodeguero@example.com',
      password: hashedPassword,
      rolId: rolBodeguero.id,
      emailVerified: true,
    },
  });

  const userSupervisor = await prisma.user.create({
    data: {
      name: 'Supervisor User',
      email: 'supervisor@example.com',
      password: hashedPassword,
      rolId: rolSupervisor.id,
      emailVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Jefe User',
      email: 'jefe@example.com',
      password: hashedPassword,
      rolId: rolJefe.id,
      emailVerified: true,
    },
  });
  console.log('Users created');

  const catHerramientas = await prisma.categoria.create({
    data: { nombre: 'Herramientas' },
  });
  const catMateriales = await prisma.categoria.create({
    data: { nombre: 'Materiales de Construcción' },
  });

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
