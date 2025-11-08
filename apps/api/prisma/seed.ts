import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crea workspace di default
  const workspace = await prisma.workspace.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Default Workspace',
      slug: 'default',
    },
  });

  console.log('✅ Created workspace:', workspace.name);

  // Crea un progetto di esempio
  const project = await prisma.project.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      title: 'Digital Transformation 2025',
      description: 'Strategic digital transformation initiatives',
      workspaceId: workspace.id,
      ownerId: '1',
      status: 'ACTIVE',
      intent: {},
    },
  });

  console.log('✅ Created project:', project.title);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
