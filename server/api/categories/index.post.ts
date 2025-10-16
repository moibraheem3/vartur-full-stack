import prisma from "~/lib/prisma";
import { object, string, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Category"],
    description: "Create Category",
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
  const { name, parentId } = body;

  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parent) {
      throw createError({
        statusCode: 404,
        statusMessage: `No Category with this id: "${parentId}"`,
      });
    }
  }

  const category = await prisma.category.create({
    data: {
      name,
      parentId,
    },
  });

  return { category };
});

const schema = object({
  name: string().required(),
  parentId: number().required().positive(),
});
