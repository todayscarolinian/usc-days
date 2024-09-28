export interface GoogleUserMetadata {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  phone_verified: boolean;
  picture: string;
  provider_id: string;
  sub: string;
}

export interface GoogleSession {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: GoogleUserMetadata; // Referencing the `UserMetadata` interface
  identities: GoogleIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface GoogleIdentity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: Record<string, any>; // Since identity_data is dynamic, we'll use a generic object type
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}