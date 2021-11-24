import { acceptRequest } from './../features/headerChat/headerChatSlice';
import axios from 'axios';
import { FriendTypes } from 'constants/FriendTypes';

const API = 'http://localhost:4000';

export const friendApi = {
  findFriend: (params: FriendTypes) => {

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
      .post(`http://localhost:4000/user/sendRequest`, {
        sendTo:  params.phoneNumber,
        owners: localStorage.getItem('access_token')
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  listRequest: () => {
    return axios
      .post(`http://localhost:4000/user/allRequestAddFriend`, {
        owners: localStorage.getItem('access_token')
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  listPending: () => {
    return axios
      .post(`http://localhost:4000/user/allPendingFriend`, {
        owners: localStorage.getItem('access_token')
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  acceptRequest: (params: string  ) => {
    return axios
      .post(`http://localhost:4000/user/acceptAddFriend`, {
        owners: localStorage.getItem('access_token'),
        phoneNumber: params
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  denyRequest: (params: string) => {
    return axios
      .post(`http://localhost:4000/user/denyAcceptAddFriend`, {
        owners: localStorage.getItem('access_token'),
        phoneNumber: params
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
