import { Avatar, Button, Modal, Space, Typography } from 'antd';
import {
  VideoCameraOutlined,
  PoweroffOutlined,
  AudioOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useAppSelector } from 'app/hooks';
import { FC } from 'react';
const { Title, Text } = Typography;

const ReceiverCall: FC<{ peer: any }> = ({ peer }) => {
  const isVisible = useAppSelector((state) => state.contentChat.isVisibleReceiver);
  const voiceCall = useAppSelector((state) => state.contentChat.voiceCall); // receiver
  const handleAccept = () => {};
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
          {/* <video src={}></video> */}

          <Space direction="vertical" size="large" style={{ transform: 'translateY(90px)' }}>
            <Avatar className="phone-call__caller__avatar" size={128} icon={<UserOutlined />} />
            <Space direction="vertical" size="small">
              <Title style={{ margin: 0, color: 'white' }} level={3}></Title>
              <Text type="secondary" style={{ color: '#dedede' }}>
                00:00
              </Text>
            </Space>
          </Space>
        </div>
        <div className="phone-call__controller">
          {/* <InCall /> */}
          <div className="before-call">
            <Button
              type="primary"
              size="large"
              shape="circle"
              icon={<PhoneOutlined />}
              onClick={handleAccept}
              style={{ backgroundColor: '#26db26', borderColor: '#26db26' }}
            />
            <Button type="primary" size="large" danger shape="circle" icon={<PoweroffOutlined />} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiverCall;
