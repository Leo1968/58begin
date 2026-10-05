import { z } from "zod";

export const chatCreateSchema = z.object({
  message: z.string().trim().min(1).max(600),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(600)
      })
    )
    .max(6)
    .optional()
});

export type ChatCreateInput = z.infer<typeof chatCreateSchema>;

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatCreateResponse =
  | { ok: true; reply: string }
  | { ok: false; code: "INVALID" | "RATE_LIMIT" | "AI_ERROR" };
