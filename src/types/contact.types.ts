import { z } from "zod";

export const contactFormSchema = z
.object({
  firstName: z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "First name is required."
                : "First name must be a string.",
    })
    .min(1, "First name is required"),
  lastName: z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "Last name is required."
                : "Last name must be a string.",
    })
    .min(1, "Last name is required"),
  email: z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "Email is required."
                : "Email must be a string.",
    })
    .email("Please enter a valid email address"),
  message: z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "Message is required."
                : "Message must be a string.",
    })
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
