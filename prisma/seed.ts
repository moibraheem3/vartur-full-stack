import bcrypt from "bcryptjs";
import prisma from "~/lib/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
