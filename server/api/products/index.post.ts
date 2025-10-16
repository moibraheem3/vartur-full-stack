import prisma from "~/lib/prisma";
import { object, string, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Product"],
    description: "Create Product",
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
  const { name, description, price, categoryId } = body;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: `No Category with this id: "${categoryId}"`,
    });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
    },
  });

  return { product };
});

const schema = object({
  name: string().required(),
  price: number().required().positive(),
  categoryId: number().required().positive(),
  description: string(),
});
