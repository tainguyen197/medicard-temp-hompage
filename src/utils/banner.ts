import { z } from "zod";

export const bannerSchema = z.object({
  type: z.string().min(1, "Banner type is required"),
  link: z.string().url("Invalid URL").optional().or(z.literal("")).nullable(),  // Add .nullable()
  status: z.enum(["ACTIVE", "INACTIVE"]),
  imageFile: z.any().optional(),
  imageEnFile: z.any().optional(),
  imageUrl: z.string().min(1, {message: "Image is required"}),
  imageEnUrl: z.any().optional(),
  imageId: z.string().nullable().optional(),
  imageEnId: z.string().nullable().optional(),
});