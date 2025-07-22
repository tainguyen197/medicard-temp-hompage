import { z } from "zod";
export const MAX_DESCRIPTION_LENGTH = 300; // Based on longest current description
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const teamMemberSchema = z.object({
    name: z.string().min(1, "Full Name (Vietnamese) is required"),
    nameEn: z.string().optional(),
    title: z.string().min(1, "Professional Title (Vietnamese) is required"),
    titleEn: z.string().optional(),
    description: z.string().min(1, "Description (Vietnamese) is required").max(MAX_DESCRIPTION_LENGTH),
    descriptionEn: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    order: z.coerce.number().min(0),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    imageFile: z.any().optional(),
    imageEnFile: z.any().optional(),
    existingImageUrl: z.string().min(1, {message: "Image is required"}),
    existingImageEnUrl: z.string().optional(),
  });

