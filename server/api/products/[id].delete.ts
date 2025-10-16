import prisma from "~/lib/prisma";
import { object, number } from "yup";

defineRouteMeta({
  openAPI: {
    tags: ["Product"],
    description: "Delete one Product",
    parameters: [{ in: "query", name: "id", required: true }],
  },
});

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.validateSync(data),
  );
  const id = params.id;

  await prisma.product.delete({
    where: { id },
  });

  return { message: "Product has been deleted successfully" };
});

const paramSchema = object({
  id: number().required().positive(),
});
