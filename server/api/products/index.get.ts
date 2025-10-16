import prisma from "~/lib/prisma";

defineRouteMeta({
  openAPI: {
    tags: ["Product"],
    description: "Get all Products",
  },
});

export default eventHandler(async (event) => {
  const products = await prisma.product.findMany();

  return { products };
});
