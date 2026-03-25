import { z } from "zod";
import { createFeedPostSchema } from "./createFeedPostSchema";

export const updateFeedPostSchema = createFeedPostSchema.partial().extend({
  postId: z.string().uuid(),
});

export type UpdateFeedPostInput = z.infer<typeof updateFeedPostSchema>;
