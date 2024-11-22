// prisma/seed.ts

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Definir los parámetros existentes con nombres actualizados
  const parameters = [
    { name: 'pH', description: 'El pH mide la acidez o alcalinidad de una solución.' },
    { name: 'Temperature', description: 'La temperatura es una medida del calor.' },
    { name: 'DissolvedOxygen', description: 'El oxígeno disuelto en el agua es esencial para la vida acuática.' },
    { name: 'Turbidity', description: 'La turbidez es una medida de la claridad del agua.' },
    { name: 'TDS', description: 'Los sólidos disueltos totales en el agua.' },
  ];

  // Insertar o actualizar parámetros
  const createdParameters = [];
  for (const param of parameters) {
    const createdParam = await prisma.parameter.upsert({
      where: { name: param.name },
      update: { description: param.description },
      create: param,
    });
    createdParameters.push(createdParam);
  }

  // Definir reglas de medición con nombres actualizados
  const measurementRules = [
    {
      parameterId: createdParameters.find(p => p.name === 'pH')!.id,
      optimalMin: 6.5,
      optimalMax: 8.0,
      action: 'Enviar alerta de pH fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'Temperature')!.id,
      optimalMin: 14.0,
      optimalMax: 20.0,
      action: 'Enviar alerta de temperatura fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'DissolvedOxygen')!.id,
      optimalMin: 5.0,
      optimalMax: 8.0,
      action: 'Enviar alerta de oxígeno disuelto fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'Turbidity')!.id,
      optimalMin: null,
      optimalMax: 5.0,
      action: 'Enviar alerta de turbidez fuera de rango',
      active: true,
    },
    {
      parameterId: createdParameters.find(p => p.name === 'TDS')!.id,
      optimalMin: null,
      optimalMax: 500.0,
      action: 'Enviar alerta de TDS fuera de rango',
      active: true,
    },
  ];

  // Insertar o actualizar reglas de medición
  for (const rule of measurementRules) {
    await prisma.measurementRule.upsert({
      where: { parameterId: rule.parameterId },
      update: {
        optimalMin: rule.optimalMin,
        optimalMax: rule.optimalMax,
        action: rule.action,
        active: rule.active,
      },
      create: rule,
    });
  }

  console.log('Parámetros y reglas de medición actualizados correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });