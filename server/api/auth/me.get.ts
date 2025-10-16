defineRouteMeta({
  openAPI: {
    tags: ["Auth"],
    description: "Get current user",
    security: [{}],
  },
});
export default defineEventHandler(async (event) => {
  return {
    user: event.context.user as {
      id: number;
      email: string | null;
      username: string;
    },
  };
});
