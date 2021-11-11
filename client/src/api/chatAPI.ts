import axios from 'axios';
import { messageStructure } from 'constants/ChatTypes';

const API = 'http://localhost:4000';

export const chatApi = {
  sendMessage: (params: messageStructure) => {
    return axios
      .post(`${API}/chat/sendMessage`, {
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
  listMessage: (params: messageStructure) => {
    
    return axios
      .post(`${API}/chat/sendMessage`, {
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
  renderListChat: () => {
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
  renderMessage: () => {
    console.log(localStorage.getItem('room_id'));
    return axios
    .post(`${API}/chat/listMessages`, {
      chatRoom: localStorage.getItem('room_id'),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  }
};
