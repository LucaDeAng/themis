import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const userId = '00000000-0000-0000-0000-000000000001';
  const workspaceId = '00000000-0000-0000-0000-000000000002';
  const projectId = '00000000-0000-0000-0000-000000000003';

  // Crea utente di default
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'admin@themis.local',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created user:', user.email);

  // Crea workspace di default
  const workspace = await prisma.workspace.upsert({
    where: { id: workspaceId },
    update: {},
    create: {
      id: workspaceId,
      name: 'Default Workspace',
      slug: 'default',
    },
  });

  console.log('✅ Created workspace:', workspace.name);

  // Crea un progetto di esempio
  const project = await prisma.project.upsert({
    where: { id: projectId },
    update: {},
    create: {
      id: projectId,
      title: 'Digital Transformation 2025',
      description: 'Strategic digital transformation initiatives',
      workspaceId: workspace.id,
      ownerId: user.id,
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
