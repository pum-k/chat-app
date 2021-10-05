import axios from 'axios';
import { LoginInput, RegisterInput } from 'constants/AccountTypes';

const API = process.env.API_URL;

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
    return axios
      .post(`${API}/login`, {
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
