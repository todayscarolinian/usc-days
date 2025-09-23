import { ValidationResult, ExtractedMetadata, ValidatableMetadata } from '@/types/metadata.types';

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

// Re-export types for convenience
export type { ExtractedMetadata, ValidatableMetadata, ValidationResult };