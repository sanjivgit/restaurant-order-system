import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.create({
    data: { name: 'Demo Restaurant', email: 'contact@demo-restaurant.com' },
  });

  const branch = await prisma.branch.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Main Branch',
      address: '123 Demo Street',
      status: 'ACTIVE',
    },
  });

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.employee.create({
    data: {
      employeeCode: 'EMP-00001',
      name: 'Super Admin',
      email: 'admin@demo-restaurant.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const category = await prisma.menuCategory.create({
    data: { branchId: branch.id, name: 'Pizza' },
  });

  await prisma.menuItem.create({
    data: {
      branchId: branch.id,
      categoryId: category.id,
      name: 'Margherita Pizza',
      description: 'Classic cheese and tomato pizza.',
      price: 299.0,
      isVeg: true,
      isAvailable: true,
    },
  });

  const table = await prisma.table.create({
    data: { branchId: branch.id, tableNumber: 'T1' },
  });
  await prisma.table.update({
    where: { id: table.id },
    data: { qrCodeUrl: `https://domain.com/order/${table.id}` },
  });

  console.log('Seed complete.');
  console.log(`Admin login -> email: ${admin.email}, password: Admin@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
