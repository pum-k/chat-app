import axios from 'axios';
import { LoginInput, RegisterInput } from 'constants/AccountTypes';

const API = 'http://localhost:4000';

export const accountApi = {
  login: (params: LoginInput) => {
    return axios
      .post(`${API}/login`, {
        username: params.username,
        password: params.password,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  register: (params: RegisterInput) => {
    // console.log(API);
    return axios
      .post(`${API}/register`, {
        username: params.username,
        password: params.password,
        phoneNumber: params.phoneNumber,
        dateOfBirth: params.dateOfBirth,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
