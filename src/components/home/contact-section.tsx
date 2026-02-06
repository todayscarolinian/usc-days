import PublicationInfo from "./publication-info";
import ContactForm from "./contact-form";

export default function ContactSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
      <PublicationInfo />
      <div className="space-y-8">
        <ContactForm />
      </div>
    </div>
  );
}