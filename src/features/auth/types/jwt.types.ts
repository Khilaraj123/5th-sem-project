export interface DecodedToken {
  sub: string; // Subject (often user ID or email)
  email?: string;
  name?: string;
  role?: string;
  exp: number; // Expiration timestamp (seconds since epoch)
  iss?: string; // Issuer
  aud?: string; // Audience
}
