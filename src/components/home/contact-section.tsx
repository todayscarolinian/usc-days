"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | "idle" | "sending" | "sent" | "error">(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (message.trim().length > 500) {
      newErrors.message = "Message must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus("sending");
    try {
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          message 
        }),
        headers: { "Content-Type": "application/json" },
      });
      setStatus("sent");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch (err) {
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

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-tc_primary text-white font-semibold py-2 px-4 rounded text-center hover:opacity-90 transition"
            
          >
            Share Your Feedback
          </a>
        </div>

      </div>

      {/* Contact Form */}
      <div className="space-y-8">
        <div className="bg-white text-slate-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Talk to Us</h3>
          <p className="text-sm text-gray-600 mb-4">
            Have questions? Send us a message and we'll get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) {
                      setErrors({ ...errors, firstName: "" });
                    }
                  }}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tc_primary ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-xs text-red-600 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tc_primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tc_primary ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Message (10-500 characters)"
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) {
                    setErrors({ ...errors, message: "" });
                  }
                }}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tc_primary ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                rows={4}
              />
              {errors.message && (
                <p id="message-error" className="text-xs text-red-600 mt-1">
                  {errors.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/500 characters
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-tc_primary text-white font-semibold py-2 rounded hover:opacity-90 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-tc_primary focus:ring-offset-2"
              disabled={status === "sending"}
              aria-busy={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>

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
        </div>
      </div>
    </div>
  );
}