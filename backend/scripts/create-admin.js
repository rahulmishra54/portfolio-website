import "dotenv/config";
import bcrypt from "bcrypt";
import connectDatabase from "../src/config/db.js";
import Admin from "../src/models/Admin.js";

const SALT_ROUNDS = 12;

async function main() {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
      process.exit(1);
    }

    await connectDatabase();

    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      SALT_ROUNDS
    );

    await Admin.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("✅ Admin created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:");
    console.error(error);
    process.exit(1);
  }
}

main();