// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // Crear usuarios de ejemplo
//   await prisma.user.createMany({
//     data: [
//       {
//         firstName: 'Juan',
//         lastName: 'Pérez',
//         email: 'juan.perez@example.com',
//         password: 'password123',
//         role: 'SUPER_ADMIN',
//         phone: '5551234567',
//       },
//       // Añade más usuarios si lo deseas
//     ],
//   });

//   // Crear ajolotarios de ejemplo
//   await prisma.ajolotary.createMany({
//     data: [
//       {
//         name: 'Ajolotario Central',
//         location: 'Ciudad de México',
//         description: 'Ajolotario principal de la ciudad',
//         permitNumber: 'PERM-12345',
//       },
//       // Añade más ajolotarios si lo deseas
//     ],
//   });

//   // Crear tanques de ejemplo
//   await prisma.tank.createMany({
//     data: [
//       {
//         name: 'Tanque A',
//         capacity: 100.0,
//         observations: 'Tanque principal',
//         status: 'ACTIVE',
//         ajolotaryId: 1, // Asegúrate de que este ID coincide con un ajolotario existente
//       },
//       // Añade más tanques si lo deseas
//     ],
//   });

//   // Crear axolotes de ejemplo
//   await prisma.axolotl.createMany({
//     data: [
//       {
//         name: 'Axolotl A',
//         species: 'Ambystoma mexicanum',
//         age: 2,
//         health: 'HEALTHY',
//         size: 15.5,
//         weight: 120.0,
//         stage: 'ADULT',
//         tankId: 1, // Asegúrate de que este ID coincide con un tanque existente
//       },
//       // Añade más axolotes si lo deseas
//     ],
//   });

//   // Crear alertas de ejemplo
//   await prisma.alert.createMany({
//     data: [
//       {
//         measurementId: 1, // Asegúrate de que este ID coincide con una medición existente
//         alertType: 'PARAMETER_OUT_OF_RANGE',
//         description: 'Temperatura fuera de rango en Tanque A',
//         priority: 'HIGH',
//         status: 'PENDING',
//       },
//       // Añade más alertas si lo deseas
//     ],
//   });

//   // Continúa creando datos para otros modelos si es necesario
// }

// main()
//   .then(async () => {
//     console.log('Datos de ejemplo agregados exitosamente.');
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error('Error al agregar datos de ejemplo:', e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
