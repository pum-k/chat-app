import axios from 'axios';
import { FriendTypes } from 'constants/FriendTypes';

const API = 'http://localhost:4000';

export const friendApi = {
  findFriend: (params: FriendTypes) => {
    console.log('api call');
    
    return axios
      .post(`http://localhost:4000/user/findFriend`, {
        phoneNumber:  params.phoneNumber
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
