export type CheckInActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

export const CHECK_IN_INITIAL_STATE: CheckInActionState = {
  success: false,
};
