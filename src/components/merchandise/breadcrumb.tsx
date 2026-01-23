import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  categoryName: string;
}

export default function Breadcrumb({ categoryName }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900 transition">
        Home
      </Link>
      <ChevronRight size={16} className="text-gray-400" />
      <Link href="/#featured-merch" className="hover:text-gray-900 transition">
        Merchandise
      </Link>
      <ChevronRight size={16} className="text-gray-400" />
      <span className="text-gray-900 font-medium">{categoryName}</span>
    </nav>
  );
}