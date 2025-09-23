interface ValidationResult {
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
type ValidatableMetadata = ExtractedMetadata | {
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

export function validateMetadata(metadata: ValidatableMetadata): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required OpenGraph fields
  if (!metadata.openGraph?.title) {
    errors.push('Missing OpenGraph title');
  }
  
  if (!metadata.openGraph?.description) {
    errors.push('Missing OpenGraph description');
  }
  
  if (!metadata.openGraph?.images?.[0]) {
    errors.push('Missing OpenGraph image');
  }
  
  if (!metadata.openGraph?.url) {
    warnings.push('Missing OpenGraph URL (recommended)');
  }

  // Check Twitter Card fields
  if (!metadata.twitter?.card) {
    errors.push('Missing Twitter card type');
  }
  
  if (!metadata.twitter?.title) {
    errors.push('Missing Twitter title');
  }
  
  if (!metadata.twitter?.description) {
    errors.push('Missing Twitter description');
  }

  // Check image dimensions and format
  const ogImage = metadata.openGraph?.images?.[0];
  if (ogImage) {
    if (ogImage.width !== 1200 || ogImage.height !== 630) {
      warnings.push('OpenGraph image should be 1200x630px for optimal display');
    }
  }

  // Check title and description lengths
  if (metadata.title && metadata.title.length > 60) {
    warnings.push('Title should be under 60 characters for optimal display');
  }
  
  if (metadata.description && metadata.description.length > 160) {
    warnings.push('Description should be under 160 characters for optimal display');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Development helper function
export function logMetadataValidation(metadata: ValidatableMetadata, pageName: string) {
  if (process.env.NODE_ENV === 'development') {
    const validation = validateMetadata(metadata);
    
    console.group(`📋 Metadata Validation: ${pageName}`);
    
    if (validation.isValid) {
      console.log('✅ All required metadata fields are present');
    } else {
      console.log('❌ Validation errors:', validation.errors);
    }
    
    if (validation.warnings.length > 0) {
      console.log('⚠️ Warnings:', validation.warnings);
    }
    
    console.groupEnd();
  }
}