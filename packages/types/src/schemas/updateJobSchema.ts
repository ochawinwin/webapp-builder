import { z } from "zod";
import { createJobSchema } from "./createJobSchema";

export const updateJobSchema = createJobSchema.partial();

export type UpdateJobInput = z.infer<typeof updateJobSchema>;
