export interface MetadataOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ExtractedMetadata {
  title?: string | null;
  description?: string | null;
  openGraph?: {
    title?: string | null;
    description?: string | null;
    url?: string | null;
    images?: {
      url?: string | null;
      width?: number;
      height?: number;
    }[];
  };
  twitter?: {
    card?: string | null;
    title?: string | null;
    description?: string | null;
    images?: string[];
  };
}

// Union type to accept both Next.js Metadata and ExtractedMetadata
export type ValidatableMetadata = ExtractedMetadata | {
  title?: string;
  description?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    images?: {
      url?: string;
      width?: number;
      height?: number;
      alt?: string;
    }[];
    type?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
    site?: string;
  };
};