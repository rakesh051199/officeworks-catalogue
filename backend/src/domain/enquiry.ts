import { z } from "zod";

export const enquirySchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(254),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000)
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function parseEnquiry(body: unknown): EnquiryInput {
  return enquirySchema.parse(body);
}
