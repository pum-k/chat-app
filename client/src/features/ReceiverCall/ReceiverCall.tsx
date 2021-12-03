import { Avatar, Button, Modal, Space, Typography } from 'antd';
import {
  PoweroffOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FC, useRef } from 'react';
import { handleVisiblePhoneCall } from 'features/contentChat/contentChatSlice';
import InCall from 'features/InCall/InCall';
const { Title, Text } = Typography;

const ReceiverCall: FC<{ peer: any }> = ({ peer }) => {
  const isVisible = useAppSelector((state) => state.contentChat.isVisibleReceiver);
  const MyVideo = useRef<any>();
  const isCallNow = useAppSelector((state) => state.contentChat.isVisiblePhoneCall);
  const dispatch = useAppDispatch();
  const receiver = useAppSelector((state) => state.contentChat.receiver); // receiver
  const handleAccept = () => {
    dispatch(handleVisiblePhoneCall(true));
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream: any) => {
        let call = peer.call(receiver.peerid, stream);
        call.on('stream', (remoteStream: any) => {
          if (MyVideo.current != null) {
            MyVideo.current.srcObject = remoteStream;
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
          <video ref={MyVideo}></video>

          <Space direction="vertical" size="large" style={{ transform: 'translateY(90px)' }}>
            <Avatar className="phone-call__caller__avatar" size={128} icon={<UserOutlined />} />
            <Space direction="vertical" size="small">
              <Title style={{ margin: 0, color: 'white' }} level={3}>
                {receiver.displayName || receiver.username}
              </Title>
              <Text type="secondary" style={{ color: '#dedede' }}>
                00:00
              </Text>
            </Space>
          </Space>
        </div>
        <div className="phone-call__controller">
          {isCallNow ? (
            <InCall />
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
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReceiverCall;
