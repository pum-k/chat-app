export type AccountState = {
  id: string;
  displayName: string;
  dateOfBirth: number | null;
  isMale: Boolean | null;
  loadding: Boolean;
  error: string;
  isSuccess: Boolean;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string;
};
