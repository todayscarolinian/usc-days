import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { PUBLICATION } from "@/src/constants/publication";

export default function PublicationInfo() {
  return (
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
          aria-label="Visit Today's Carolinian Facebook page"
        >
          <Facebook size={18} />
        </a>
        <a
          href={PUBLICATION.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-white/30 rounded-lg p-2 text-white hover:text-white/70 transition"
          aria-label="Visit Today's Carolinian Instagram page"
        >
          <Instagram size={18} />
        </a>
        <a
          href={PUBLICATION.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-white/30 rounded-lg p-2 text-white hover:text-white/70 transition"
          aria-label="Visit Today's Carolinian YouTube channel"
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
  );
}