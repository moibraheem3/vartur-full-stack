import prisma from "~/lib/prisma";

defineRouteMeta({
  openAPI: {
    tags: ["Category"],
    description: "Get all Categories",
  },
});


export default eventHandler(async (event) => {
  const categories = await prisma.category.findMany({
    include: {
      children: {
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  return { categories };
});
