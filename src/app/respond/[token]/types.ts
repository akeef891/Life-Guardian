import type { ContactResponseStatus } from "@/types/emergency-response";

export type SubmitResponseState = {
  success: boolean;
  message?: string;
  error?: string;
  status?: ContactResponseStatus;
};

export const SUBMIT_RESPONSE_INITIAL_STATE: SubmitResponseState = {
  success: false,
};
