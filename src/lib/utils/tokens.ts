import { randomBytes } from "crypto";

export function generateQrToken() {
  return randomBytes(24).toString("base64url");
}

export function generateResponseToken() {
  return randomBytes(32).toString("base64url");
}
