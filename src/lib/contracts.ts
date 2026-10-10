import { z } from "zod";
import { BranchSchema, NameSchema, PageSchema } from "./story.ts";
export const ContextSchema = z.object({
  name: NameSchema,
  history: z.array(BranchSchema).max(9),
});
export const InterpretSchema = ContextSchema.extend({
  order: z.string().trim().min(1).max(600),
});
export const GenerateSchema = ContextSchema.extend({
  branch: BranchSchema,
  order: z.string().trim().min(1).max(600),
  previousPages: z.array(PageSchema).min(1).max(9),
}).refine(
  (v) =>
    v.history.length < 9 && v.previousPages.length === v.history.length + 1,
  "Invalid story position",
);
export const ArtRequestSchema = ContextSchema.extend({ page: PageSchema });
export const NarrativeSchema = z.object({
  title: z.string().min(1).max(90),
  panels: z
    .array(
      z.object({
        caption: z.string().min(1).max(260),
        dialogue: z.string().min(1).max(320),
      }),
    )
    .length(4),
});
export const InterpretationSchema = z.object({
  branch: BranchSchema.nullable(),
  confirmation: z.string().max(400),
  clarification: z.string().max(400).nullable(),
});
export const ConfigSchema = z.object({
  live: z.boolean(),
  realtime: z.boolean(),
  images: z.boolean(),
  reason: z.string(),
});
export type ServiceConfig = z.infer<typeof ConfigSchema>;
