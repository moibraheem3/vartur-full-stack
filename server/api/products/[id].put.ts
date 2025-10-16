import prisma from "~/lib/prisma";
import { object, string, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Product"],
    description: "Update Product",
    parameters: [{ in: "query", name: "id", required: true }],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              description: {
                type: "string",
              },
              categoryId: {
                type: "number",
              },
              price: {
                type: "number",
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
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.validateSync(data),
  );
  const { name, description, price, categoryId } = body;
  const id = params.id;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (product) {
    throw createError({
      statusCode: 404,
      statusMessage: `No Product with this id: "${id}"`,
    });
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: `No Category with this id: "${categoryId}"`,
    });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      categoryId,
    },
  });

  return { product: updated };
});

const schema = object({
  name: string().required(),
  price: number().required().positive(),
  categoryId: number().required().positive(),
  description: string(),
});

const paramSchema = object({
  id: number().required().positive(),
});
