import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";
import { object, string } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Auth"],
    description: "Login",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              username: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
});

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) =>
    schema.validateSync(data),
  );
  const { username, password } = body;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  await useStorage("redis").setItem(`auth::token::${user.id}`, token, {
    EX: 3600,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
});

const schema = object({
  username: string().required().min(3),
  password: string().required().min(5),
});
