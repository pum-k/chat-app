import axios from 'axios';
import { updateUserType } from 'constants/accountModalTypes';
import { LoginInput, RegisterInput } from 'constants/AccountTypes';

const API = 'http://localhost:4000';

export const userApi = {
  login: (params: LoginInput) => {
    return axios
      .post(`${API}/login`, {
        username: params.username,
        password: params.password,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  register: (params: RegisterInput) => {
    return axios
      .post(`${API}/register`, {
        username: params.username,
        password: params.password,
        phoneNumber: params.phoneNumber,
        dateOfBirth: params.dateOfBirth,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getLoggedUser: () => {
    return axios
      .post(`${API}/user/getInfoUser`, {
        owners: localStorage.getItem('access_token'),
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  updateUser: (params: updateUserType) => {
    return axios
      .post(`${API}/user/editUserInfo`, {
        owners: localStorage.getItem('access_token'),
        dateOfBirth: params.dateOfBirth,
        displayName: params.displayName,
        gender: params.gender,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  updateImage: (params: any) => {
    return axios
      .post(`http://localhost:4000/user/setAvater`, params)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  updateCover: (params: any) => {
    return axios
      .post(`http://localhost:4000/user/setCoverImage`, params)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  blockUser: (params: any) => {
    return axios
      .post(`http://localhost:4000/chat/blockRoom`, params)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  unBlockUser: (params: any) => {
    return axios
      .post(`http://localhost:4000/chat/unBlockRoom`, params)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  unFriend: (params: {owners: string | null, nameUnfriend: string}) => {
    return axios
      .post(`http://localhost:4000/user/unfriend`, params)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  sendImage: (params: any) => {
    return axios
      .post(`http://localhost:4000/chat/sendImage`, params)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
