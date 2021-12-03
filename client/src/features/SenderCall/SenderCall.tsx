import { Avatar, Button, Modal, Space, Tooltip, Typography } from 'antd';
import {
  VideoCameraOutlined,
  PoweroffOutlined,
  AudioOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useAppSelector } from 'app/hooks';
const { Title, Text } = Typography;
const SenderCall = () => {
    const isVisible = useAppSelector(state => state.contentChat.isVisibleSender);
    const sender = useAppSelector(state => state.accountModal.user); // sender

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
              <Title style={{ margin: 0, color: 'white' }} level={3}>
                Con CAc
              </Title>
              <Text type="secondary" style={{ color: '#dedede' }}>
                00:00
              </Text>
            </Space>
          </Space>
        </div>
        <div className="phone-call__controller">
          {/* <InCall /> */}
          <Tooltip title="Hang up">
            <Button type="primary" size="large" danger shape="circle" icon={<PoweroffOutlined />} />
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
};

export default SenderCall;
