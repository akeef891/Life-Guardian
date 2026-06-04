export type SaveProfileState = {
  success: boolean;
  message?: string;
  error?: string;
};

export type ContactActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

export const CONTACT_ACTION_INITIAL_STATE: ContactActionState = {
  success: false,
};
