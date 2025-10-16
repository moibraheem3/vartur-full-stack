import prisma from "~/lib/prisma";
import { object, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Category"],
    description: "Get one Category",
    parameters: [{ in: "query", name: "id", required: true }],
  },
});

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.validateSync(data),
  );
  const id = params.id;

  const category = await prisma.category.findUnique({
    where: { id },
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
  return { category };
});

const paramSchema = object({
  id: number().required().positive(),
});
