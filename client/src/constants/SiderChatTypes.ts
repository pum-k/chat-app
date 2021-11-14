export type ListRoomChat =  {
    loading: boolean
    data: Array<RoomChatRender>
}


export type RoomChatRender = {
    room_id: string;
    friend_name: string;
    friend_avatar: any;
    last_message: string;
}