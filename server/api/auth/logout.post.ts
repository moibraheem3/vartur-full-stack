import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";

defineRouteMeta({
  openAPI: {
    tags: ["Auth"],
    description: "Logout",
    security: [{}],
  },
});

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw createError({
        statusCode: 401,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    await useStorage("redis").removeItem(`auth::token::${user.id}`);

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (e) {
    console.error("Logout error:", e);
    throw createError({
      statusCode: 500,
      message: "Error during logout",
    });
  }
});
