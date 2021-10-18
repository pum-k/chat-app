export interface messageStructure {
  create_at: any;
  line_text: string;
  user_name: string;

}

export interface ChatState {
  messages: Array<messageStructure>,
  ListRoomChat: Array<RoomChatStructure>,
  loadding: boolean,
}

export interface RoomChatStructure {
  RoomName:  string;
  RoomSocketId: string;
}