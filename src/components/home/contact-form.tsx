"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { contactFormSchema, type ContactFormValues } from "@/src/types/contact.types";

export default function ContactForm() {
  const [status, setStatus] = React.useState<null | "sending" | "sent" | "error">(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    if (status === "sent") {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function onSubmit(values: ContactFormValues) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  }

  return (
    <div className="bg-white text-slate-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">Talk to Us</h3>
      <p className="text-sm text-gray-600 mb-4">
        Have questions? Send us a message and we'll get back to you soon.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    placeholder="Message (10-500 characters)"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  {field.value.length}/500 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-tc_primary text-white"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Submit"}
          </Button>

          {status === "sent" && (
            <div role="alert" className="text-sm text-green-600 p-2 bg-green-50 rounded">
              Message sent — thank you!
            </div>
          )}
          {status === "error" && (
            <div role="alert" className="text-sm text-red-600 p-2 bg-red-50 rounded">
              Error sending — please try again.
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}