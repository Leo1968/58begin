import { z } from "zod";

export const leadCreateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email().max(120).optional(),
  wechat: z.string().trim().min(2).max(40).optional(),
  company: z.string().trim().min(1).max(80).optional(),
  intent: z.enum(["course", "consulting", "partnership", "other"]),
  message: z.string().trim().max(2000).optional(),
  sourceUrl: z.string().trim().url(),
  utm: z.record(z.string(), z.string().optional()).optional(),
  lang: z.enum(["zh", "en"]),
  hp: z.string().optional()
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

