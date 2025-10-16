import prisma from "~/lib/prisma";
import { object, string, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Category"],
    description: "Update Category",
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
              parentId: {
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
  const { name, parentId } = body;
  const id = params.id;

  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: { id },
    });
    if (!parent) {
      throw createError({
        statusCode: 404,
        statusMessage: `No Parent Category with this id: "${parentId}"`,
      });
    }
  }

  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: `No Category with this id: "${id}"`,
    });
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name,
      parentId,
    },
  });

  return { category: updated };
});

const schema = object({
  name: string().required(),
  parentId: number().required().positive(),
});
const paramSchema = object({
  id: number().required().positive(),
});
