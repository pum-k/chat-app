export interface messageStructure {
  _id?:string;
  createAt: any;
  line_text: string;
  user_name: string;
  type?:string;
  avatar?:string;
  displayName?: string;
}

export interface ChatState {
  messages: Array<messageStructure>,
  loading: boolean,
  listRoomChat: Array<RoomChatStructure>,
  isVisiblePhoneCall: boolean
  voiceCall?: any;
  isVisibleSender: boolean,
  isVisibleReceiver: boolean
}

export interface RoomChatStructure {
  RoomName:  string;
  RoomSocketId: string;
}