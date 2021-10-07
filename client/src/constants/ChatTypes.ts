export interface messageStructure {
  create_at: any;
  line_text: string;
  user_id: string;
  // id: string;
  // room_id: string
}

export interface ChatState {
  messages: Array<messageStructure>,
  loadding: boolean,
}
