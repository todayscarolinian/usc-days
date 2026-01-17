"use client";

import React, { useState } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

const SCHOOLS = [
  {
    id: 1,
    name: "School of Arts and Sciences",
    phone: "+63 32 401 2300",
    email: "sas@usc.edu.ph",
    social: { facebook: "#", instagram: "#", youtube: "#" },
  },
  {
    id: 2,
    name: "School of Business and Economics",
    phone: "+63 32 401 2300",
    email: "sbe@usc.edu.ph",
    social: { facebook: "#", instagram: "#", youtube: "#" },
  },
  {
    id: 3,
    name: "School of Law and Governance",
    phone: "+63 32 401 2300",
    email: "slg@usc.edu.ph",
    social: { facebook: "#", instagram: "#", youtube: "#" },
  },
  {
    id: 4,
    name: "School of Fine Arts and Design",
    phone: "+63 32 401 2300",
    email: "safad@usc.edu.ph",
    social: { facebook: "#", instagram: "#", youtube: "#" },
  },
  {
    id: 5,
    name: "School of Healthcare Professions",
    phone: "+63 32 401 2300",
    email: "shcp@usc.edu.ph",
    social: { facebook: "#", instagram: "#", youtube: "#" },
  },
  {
    id: 6,
    name: "School of Engineering",
    phone: "+63 32 401 2300",
    email: "soe@usc.edu.ph",
    social: { facebook: "#", instagram: "#", youtube: "#" },
  },
  {
    id: 7,
    name: "School of Education",
    phone: "+63 32 401 2300",
    email: "sed@usc.edu.ph",
    social: { facebook: "#", instagram: "#", youtube: "#" },
  },
];

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | "idle" | "sending" | "sent" | "error">(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" },
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
      {/* Left: School Contact Cards */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
        <p className="text-white/90 mb-6">Reach out to any of our schools directly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCHOOLS.map((school) => (
            <div
              key={school.id}
              className="border border-white/30 rounded-lg p-4 hover:bg-white/10 transition"
            >
              <h4 className="font-bold text-base mb-3">{school.name}</h4>
              <p className="text-sm text-white/90 mb-2">{school.phone}</p>
              <p className="text-sm text-white/90 mb-4">{school.email}</p>
              
              {/* Social Icons */}
              <div className="flex gap-3">
                <a
                  href={school.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/70 transition"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={school.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/70 transition"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={school.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/70 transition"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Forms */}
      <div className="space-y-8">
        {/* Contact Form */}
        <div className="bg-white text-slate-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Talk to Us</h3>
          <p className="text-sm text-gray-600 mb-4">
            Have questions? Send us a message and we'll get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />

            <textarea
              placeholder="Message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={4}
            />

            <button
              type="submit"
              className="w-full bg-tc_primary text-white font-semibold py-2 rounded hover:opacity-90 transition disabled:opacity-50"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>

            {status === "sent" && (
              <p className="text-sm text-green-600">Message sent — thank you!</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">Error sending — please try again.</p>
            )}
          </form>
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
    </div>
  );
}