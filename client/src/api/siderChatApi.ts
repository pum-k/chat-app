import axios from 'axios';

const API = 'http://localhost:4000';

export const roomApi = {
  fetchList: () => {
    return axios
      .post(`${API}/chat/listChatPage`, {
        owners: localStorage.getItem('access_token'),
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
