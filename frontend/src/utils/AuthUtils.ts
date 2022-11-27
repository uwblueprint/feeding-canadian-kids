import * as jwt from "jose";
import { DecodedJWT } from "../types/AuthTypes";

export const decodeJWT = (token: string | null): DecodedJWT | null => {
  if (!token) return null;
  return jwt.decodeJwt(token);
};

export const isUnexpiredToken = (token: string | null) => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) return false;
  if (decodedToken?.exp == null) return false;
  return decodedToken.exp <= Math.round(new Date().getTime() / 1000);
};
