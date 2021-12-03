import { Avatar, Button, Modal, Space, Tooltip, Typography } from 'antd';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FC, useRef, useEffect } from 'react';
import { handleVisiblePhoneCall } from 'features/contentChat/contentChatSlice';
import InCall from 'features/InCall/InCall';
const { Title, Text } = Typography;
const SenderCall: FC<{ peer: any }> = ({ peer }) => {
  const isVisible = useAppSelector((state) => state.contentChat.isVisibleSender);
  const MyVideo = useRef<any>();
  const dispatch = useAppDispatch();
  const isCallNow = useAppSelector((state) => state.contentChat.isVisiblePhoneCall);
  const sender = useAppSelector((state) => state.accountModal.user); // sender
  useEffect(() => {
    peer.on('call', (call: any) => {
      dispatch(handleVisiblePhoneCall(true));
      call.answer(MyVideo.current.srcObject);
      call.on('stream', (remoteStream: any) => {
        if (MyVideo.current != null) {
          MyVideo.current.srcObject = remoteStream;
        }
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
          <video ref={MyVideo}></video>

          <Space direction="vertical" size="large" style={{ transform: 'translateY(90px)' }}>
            <Avatar className="phone-call__caller__avatar" size={128} icon={<UserOutlined />} />
            <Space direction="vertical" size="small">
              <Title style={{ margin: 0, color: 'white' }} level={3}>
                {sender.user_display_name || sender.user_name}
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
            <Tooltip title="Hang up">
              <Button
                type="primary"
                size="large"
                danger
                shape="circle"
                icon={<PoweroffOutlined />}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SenderCall;
