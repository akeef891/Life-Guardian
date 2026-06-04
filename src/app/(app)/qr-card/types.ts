export type GenerateQrState = {
  success: boolean;
  message?: string;
  token?: string;
  error?: string;
};

export const GENERATE_QR_INITIAL_STATE: GenerateQrState = {
  success: false,
};
