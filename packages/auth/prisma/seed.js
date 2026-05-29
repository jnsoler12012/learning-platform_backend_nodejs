import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


// Simple seed program to generate the current structure proposed for the learning platfrom user system - first use case
const prisma = new PrismaClient();

const PERMISSIONS = [
  { slug: 'user.read', description: 'Read user profiles' },
  { slug: 'user.write', description: 'Create or update users' },
  { slug: 'user.delete', description: 'Delete users' },
  { slug: 'role.read', description: 'Read roles' },
  { slug: 'role.write', description: 'Create or update roles' },
  { slug: 'role.delete', description: 'Delete roles' },
  { slug: 'learning-path.read', description: 'Read learning paths' },
  { slug: 'learning-path.write', description: 'Create or update learning paths' },
  { slug: 'learning-path.enroll', description: 'Enroll in learning paths' },
  { slug: 'content.read', description: 'Read content nodes' },
  { slug: 'content.write', description: 'Create or update content nodes' },
  { slug: 'notes.read', description: 'Read user notes' },
  { slug: 'notes.write', description: 'Create, update or delete notes' },
  { slug: 'assessment.read', description: 'Read assessments and questions' },
  { slug: 'assessment.write', description: 'Create or update assessments and questions' },
  { slug: 'assessment.attempt', description: 'Attempt assessments' },
];

const ROLES = [
  {
    name: 'admin',
    description: 'Full system access',
    permissions: ['user.read', 'user.write', 'user.delete', 'role.read', 'role.write', 'role.delete', 'learning-path.read', 'learning-path.write', 'learning-path.enroll', 'content.read', 'content.write', 'notes.read', 'notes.write', 'assessment.read', 'assessment.write', 'assessment.attempt'],
  },
  {
    name: 'instructor',
    description: 'Can manage learning paths',
    permissions: ['user.read', 'learning-path.read', 'learning-path.write', 'learning-path.enroll', 'content.read', 'content.write', 'notes.read', 'notes.write', 'assessment.read', 'assessment.write'],
  },
  {
    name: 'student',
    description: 'Can enroll and view learning paths',
    permissions: ['user.read', 'learning-path.read', 'learning-path.enroll', 'content.read', 'notes.read', 'notes.write', 'assessment.read', 'assessment.attempt'],
  },
];

const LEARNING_PATHS = [
  { code: 'Math', title: 'Math fundamentals', description: 'Math fundamentals desc' },
  { code: 'English', title: 'English fundamentals', description: 'English fundamentals desc' },
];

const SEED_USERS = [
  {
    email: 'admin@test.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    email: 'instructor@test.com',
    password: 'instructor123',
    firstName: 'Instructor',
    lastName: 'User',
    role: 'instructor',
  },
  {
    email: 'student@test.com',
    password: 'student123',
    firstName: 'Student',
    lastName: 'User',
    role: 'student',
  },
];

async function seed() {
  console.log('Seeding started...');

  const createdPermissions = {};
  for (const perm of PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { description: perm.description },
      create: { slug: perm.slug, description: perm.description },
    });
    createdPermissions[perm.slug] = created.id;
  }
  console.log(`Seeded ${PERMISSIONS.length} permissions`);

  for (const roleData of ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: { description: roleData.description },
      create: { name: roleData.name, description: roleData.description },
    });

    for (const permSlug of roleData.permissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: createdPermissions[permSlug] } },
        update: {},
        create: { roleId: role.id, permissionId: createdPermissions[permSlug] },
      });
    }
  }
  console.log(`Seeded ${ROLES.length} roles with permissions`);

  for (const lp of LEARNING_PATHS) {
    await prisma.learningPath.upsert({
      where: { code: lp.code },
      update: { title: lp.title, description: lp.description },
      create: { code: lp.code, title: lp.title, description: lp.description },
    });
  }
  console.log(`Seeded ${LEARNING_PATHS.length} learning paths`);

  const passwordHash = await bcrypt.hash('123456', 12);
  for (const userData of SEED_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) {
      console.log(`User ${userData.email} already exists, skipping`);
      continue;
    }

    const user = await prisma.user.create({
      data: { email: userData.email, passwordHash },
    });

    await prisma.userProfile.create({
      data: {
        userId: user.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.email.split('@')[0],
      },
    });

    const role = await prisma.role.findUnique({ where: { name: userData.role } });
    if (role) {
      await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
    }

    console.log(`Created user: ${userData.email} (${userData.role})`);
  }

  console.log('Seed completed');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
