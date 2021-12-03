import { Avatar, Button, Modal, Space, Tooltip, Typography } from 'antd';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FC, useRef, useEffect, useState } from 'react';
import { handleVisiblePhoneCall, hangUpCall } from 'features/contentChat/contentChatSlice';
import InCall from 'features/InCall/InCall';
import { RoomChatRender } from 'constants/SiderChatTypes';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
const { Title, Text } = Typography;
const SenderCall: FC<{
  peer: any;
  receiver: RoomChatRender | undefined;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}> = ({ peer, receiver, socket }) => {
  const isVisible = useAppSelector((state) => state.contentChat.isVisibleSender);
  const OrtherVideo = useRef<any>();
  const dispatch = useAppDispatch();
  const isCallNow = useAppSelector((state) => state.contentChat.isVisiblePhoneCall);
  const onCam = useAppSelector((state) => state.inCall.onCam);
  const onMic = useAppSelector((state) => state.inCall.onMic);
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    peer.on('call', (call: any) => {
      navigator.mediaDevices
        .getUserMedia({
          video: onCam,
          audio: onMic,
        })
        .then((stream: MediaStream) => {
          setStream(stream);
          dispatch(handleVisiblePhoneCall(true));
          call.answer(stream);
          call.on('stream', (remoteStream: any) => {
            let newVideoRecieve = document.querySelectorAll('video');
            if (newVideoRecieve !== null && newVideoRecieve.length > 0) {
              newVideoRecieve[0].srcObject = remoteStream;
            }
          });
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      className="modal-phone-call"
      closable={false}
      maskClosable={false}
      footer={null}
      visible={isVisible}
      width={400}
    >
      <div className="phone-call">
        <div className="phone-call__caller">
          <video
            ref={OrtherVideo}
            autoPlay
            className={OrtherVideo ? 'video-call' : 'video-call video-call--off'}
          />
          <Space direction="vertical" size="large" style={{ transform: 'translateY(90px)' }}>
            <Avatar
              src={receiver && receiver.avatar}
              className="phone-call__caller__avatar"
              size={128}
              icon={<UserOutlined />}
            />
            <Space direction="vertical" size="small">
              <Title style={{ margin: 0, color: 'white' }} level={3}>
                {receiver ? receiver.displayName || receiver.friend_name : 'Not found'}
              </Title>
              <Text type="secondary" style={{ color: '#dedede' }}>
                {!isCallNow && 'Waiting...'}
              </Text>
            </Space>
          </Space>
        </div>
        <div className="phone-call__controller">
          {isCallNow ? (
            <InCall MyVideo={stream} socket={socket} />
          ) : (
            <Tooltip title="Hang up">
              <Button
                type="primary"
                size="large"
                danger
                shape="circle"
                icon={<PoweroffOutlined />}
                onClick={() => {
                  dispatch(hangUpCall());
                  socket.emit('closeCall', {
                    owner: localStorage.getItem('access_token'),
                    currentRoom: localStorage.getItem('room_id'),
                  });
                }}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SenderCall;
