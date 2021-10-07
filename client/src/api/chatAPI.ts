import axios from 'axios';
import { messageStructure } from 'constants/ChatTypes';

const API = 'http://localhost:4000';

export const chatApi = {
  sendMessage: (params: messageStructure) => {
    return axios
      .post(`http://localhost:4000/chat/sendMessage`, {
        line_text : params.line_text,
        room_id: localStorage.getItem('room_id'),
        id: localStorage.getItem('access_token'),
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
