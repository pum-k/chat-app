export type ListRoomChat =  {
    loading: boolean
    data: Array<RoomChatRender>
}


export type RoomChatRender = {
    room_id: string;
    displayName: string;
    avatar: any;
    last_message: string;
}