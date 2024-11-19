// prisma/seed.ts

const { PrismaClient, AlertType, AlertPriority, AlertStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Definir los parámetros existentes
  const parameters = [
    { name: 'pH', description: 'El pH mide la acidez...' },
    { name: 'Temperatura', description: 'La temperatura es una...' },
    { name: 'OD', description: 'El oxígeno disuelto en...' },
    { name: 'TSS', description: 'Los sólidos suspendidos...' },
    { name: 'TSD', description: 'Los sólidos disueltos...' },
  ];

  // Insertar o actualizar parámetros
  const createdParameters = [];
  for (const param of parameters) {
    const createdParam = await prisma.parameter.upsert({
      where: { name: param.name }, // Ahora válido porque 'name' es único
      update: { description: param.description },
      create: param,
    });
    createdParameters.push(createdParam);
  }

  // Definir reglas de medición
  const measurementRules = [
    {
      parameterId: createdParameters.find(p => p.name === 'pH')!.id,
      optimalMin: 6.5,
      optimalMax: 8.0,
      action: 'Enviar alerta de pH fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'Temperatura')!.id,
      optimalMin: 15.0,
      optimalMax: 18.0,
      action: 'Enviar alerta de Temperatura fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'OD')!.id,
      optimalMin: null,
      optimalMax: 6.6,
      action: 'Enviar alerta de OD fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'TSS')!.id,
      optimalMin: null,
      optimalMax: 10.0,
      action: 'Enviar alerta de TSS fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'TSD')!.id,
      optimalMin: null,
      optimalMax: 20.0,
      action: 'Enviar alerta de TSD fuera de rango',
      active: true,
    },
  ];

  // Insertar o actualizar reglas de medición
  for (const rule of measurementRules) {
    await prisma.measurementRule.upsert({
      where: { parameterId: rule.parameterId }, // Ahora válido porque 'parameterId' es único
      update: {
        optimalMin: rule.optimalMin,
        optimalMax: rule.optimalMax,
        action: rule.action,
        active: rule.active,
      },
      create: rule,
    });
  }

  console.log('Parámetros y reglas de medición insertados/actualizados correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
