import { Avatar, Button, Modal, Space, Typography } from 'antd';
import { PoweroffOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FC, useEffect, useRef, useState } from 'react';
import { handleVisiblePhoneCall, hangUpCall } from 'features/contentChat/contentChatSlice';
import InCall from 'features/InCall/InCall';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
const { Title, Text } = Typography;

const ReceiverCall: FC<{ peer: any; socket: Socket<DefaultEventsMap, DefaultEventsMap> }> = ({
  peer,
  socket,
}) => {
  const isVisible = useAppSelector((state) => state.contentChat.isVisibleReceiver);
  const OrtherVideo = useRef<any>();
  const isCallNow = useAppSelector((state) => state.contentChat.isVisiblePhoneCall);
  const dispatch = useAppDispatch();
  const receiver = useAppSelector((state) => state.contentChat.receiver); // sender info
  const onCam = useAppSelector((state) => state.inCall.onCam);
  const onMic = useAppSelector((state) => state.inCall.onMic);
  const [stream, setStream] = useState<MediaStream>();

  const handleAccept = () => {
    dispatch(handleVisiblePhoneCall(true));
    navigator.mediaDevices
      .getUserMedia({
        video: onCam,
        audio: onMic,
      })
      .then((stream: MediaStream) => {
        setStream(stream);
        let call = peer.call(receiver.peerid, stream);
        call.on('stream', (remoteStream: any) => {
          if (OrtherVideo.current) {
            OrtherVideo.current.srcObject = remoteStream;
          }
        });
      });
  };


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
              src={receiver.avatar}
              className="phone-call__caller__avatar"
              size={128}
              icon={<UserOutlined />}
            />
            <Space direction="vertical" size="small">
              <Title style={{ margin: 0, color: 'white' }} level={3}>
                {receiver.displayname || receiver.username}
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
            <div className="before-call">
              <Button
                type="primary"
                size="large"
                shape="circle"
                icon={<PhoneOutlined />}
                onClick={handleAccept}
                style={{ backgroundColor: '#26db26', borderColor: '#26db26' }}
              />
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
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReceiverCall;
