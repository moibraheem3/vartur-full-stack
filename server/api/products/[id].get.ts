import prisma from "~/lib/prisma";
import { object, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Product"],
    description: "Get one Product",
    parameters: [{ in: "query", name: "id", required: true }],
  },
});

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.validateSync(data),
  );
  const id = params.id;

  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (product) {
    return { product };
  }

  throw createError({
    statusCode: 404,
    statusMessage: `No Product with this id: "${id}"`,
  });
});

const paramSchema = object({
  id: number().required().positive(),
});
