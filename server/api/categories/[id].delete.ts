import prisma from "~/lib/prisma";
import { object, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Category"],
    description: "Detele one Category",
    parameters: [{ in: "query", name: "id", required: true }],
  },
});

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.validateSync(data),
  );
  const id = params.id;

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Category has been deleted successfully" };
});

const paramSchema = object({
  id: number().required().positive(),
});
