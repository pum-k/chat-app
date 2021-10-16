import axios from 'axios';
import { FriendTypes } from 'constants/FriendTypes';

const API = 'http://localhost:4000';

export const friendApi = {
  findFriend: (params: FriendTypes) => {
    console.log('api call');
    
    return axios
      .post(`${API}/user/findFriend`, {
        phoneNumber:  params.phoneNumber
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  addFriends: (params: FriendTypes) => {
    return axios
      .post(`${API}/user/addfriend`, {
        phoneNumber:  params.phoneNumber,
        owners: localStorage.getItem('access_token')
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
