import { JWTPayload } from "jose";

export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
  accessToken: string;
} | null;

export type DecodedJWT = JWTPayload;
