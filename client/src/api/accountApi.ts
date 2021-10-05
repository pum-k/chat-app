import { LoginInput, RegisterInput } from 'constants/AccountTypes';

export const accountApi = {
  login: (params: LoginInput) => {
    // return api here
    console.log(params);
  },
  register: (params: RegisterInput) => {
    console.log(params);
  },
};
