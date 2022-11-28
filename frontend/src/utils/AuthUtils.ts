import * as jwt from "jose";

export const decodeJWT = (token: string | null): jwt.JWTPayload | null => {
  if (!token) return null;
  return jwt.decodeJwt(token);
};

export const shouldRenewToken = (token: string | null) => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) return false;

  if (decodedToken?.exp == null) return false;

  return decodedToken.exp <= Math.round(new Date().getTime() / 1000);
};
