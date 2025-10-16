import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";

const publicAPI = [
    "/api/auth/login",
    "/api/docs/",
];

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (url.pathname.includes("/api/") && !publicAPI.includes(url.pathname)) {
    const authHeader = getHeader(event, "authorization");
    if (!authHeader) {
      throw createError({ statusCode: 401, message: "Unauthorize" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    const tokenRedis = await useStorage("redis").getItem(
      `auth::token::${decoded.userId}`,
    );
    if (token !== tokenRedis?.toString()) {
      throw createError({ statusCode: 401, message: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw createError({ statusCode: 401, message: "Invalid token" });
    }

    event.context.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
});
