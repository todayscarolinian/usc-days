"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
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

const PUBLICATION = {
  bio: "The Progressive Official Student Publication of the University of San Carlos",
  email: "contact@todayscarolinian.com",
  social: {
    facebook: "https://www.facebook.com/todayscarolinian",
    instagram: "https://www.instagram.com/todaysusc/",
    youtube: "https://www.youtube.com/@todayscarolinianusc",
  },
};

export default function ContactSection() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
      {/* Left: School Contact Cards */}
      <div className="flex flex-col justify-between">
        <Image 
            src="/tc-print-logo.png" 
            alt="Today's Carolinian Logo"
            width={300}
            height={300}
            className="h-auto"
          />
        <p className="mb-3">{PUBLICATION.bio}</p>

        {/* Email with icon */}
        <div className="flex items-center gap-2 mb-5">
          <Mail size={20} className="text-white" />
          <a 
            href={`mailto:${PUBLICATION.email}`} 
            className="text-sm text-white hover:underline"
          >
            {PUBLICATION.email}
          </a> 
        </div>

        {/* Social Icons */}
        <div className="flex gap-3 mb-6">
          <a
            href={PUBLICATION.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white/30 rounded-lg p-2 text-white hover:text-white/70 transition"
            aria-label={`Visit Today's Carolinian Facebook page`}
          >
            <Facebook size={18} />
          </a>
          <a
            href={PUBLICATION.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white/30 rounded-lg p-2 text-white hover:text-white/70 transition"
            aria-label={`Visit Today's Carolinian Instagram page`}
          >
            <Instagram size={18} />
          </a>
          <a
            href={PUBLICATION.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white/30 rounded-lg p-2 text-white hover:text-white/70 transition"
            aria-label={`Visit Today's Carolinian YouTube channel`}
          >
            <Youtube size={18} />
          </a>
        </div>

        {/* Feedback Form */}
        <div className="bg-white text-slate-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Feedback Form</h3>
          <p className="text-sm text-gray-600 mb-4">
            Help us improve! Share your experience using the USC Days app. Your feedback is valuable.
          </p>
          <Button disabled className="w-full opacity-50 cursor-not-allowed">
            Share Your Feedback
          </Button>
        </div>
      </div>

      {/* Contact Form */}
      <div className="space-y-8">
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
      </div>
    </div>
  );
}