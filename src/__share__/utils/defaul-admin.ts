import mongoose from 'mongoose';
import { User, UserSchema } from '../../user/schemas/user.schema';
import bcrypt from 'bcrypt';
import { UserRole } from 'src/__share__/enum/enum';
import * as dotenv from 'dotenv';

dotenv.config();

export async function createDefaultAdmin() {
  let UserModel;
  try {
    UserModel = mongoose.model(User.name);
  } catch {
    UserModel = mongoose.model(User.name, UserSchema);
  }

  const existingAdmin = await UserModel.findOne({ role: UserRole.ADMIN });
  if (existingAdmin) {
    console.log('ℹ️ Default admin already exists:', existingAdmin.email);
    return;
  }

  const names = process.env.ADMIN_NAMES || 'System Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@ecommerce.com';
  const phone = process.env.ADMIN_PHONE || '+250780000000';
  const address = process.env.ADMIN_ADDRESS || 'Kigali, Rwanda';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await UserModel.create({
    names,
    email,
    phone,
    address,
    password: hashedPassword,
    role: UserRole.ADMIN,
    verified: true,
  });

  console.log('✅ Default admin created successfully:', admin.email);
}
