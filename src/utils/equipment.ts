import { z } from "zod";

export const equipmentSchema = z.object({
    name: z.string().min(1, "Name (Vietnamese) is required"),
    nameEn: z.string().optional(),
    description: z.string().min(1, "Description (Vietnamese) is required"),
    descriptionEn: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    showOnHomepage: z.boolean().optional(),
    order: z.coerce.number().min(0, "Order must be 0 or greater"),
    imageId: z.string().optional(),
    imageEnId: z.string().optional(),
    imageUrl: z.string({message: "Image (Vietnamese) is required"}).min(1, "Image (Vietnamese) is required"),
    imageEnUrl: z.string().optional(),
  });