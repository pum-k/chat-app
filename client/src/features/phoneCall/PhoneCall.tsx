import { Avatar, Button, Modal, Space, Tooltip, Typography } from 'antd';
import {
  VideoCameraOutlined,
  PoweroffOutlined,
  AudioOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import './PhoneCall.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { handleCam, handleMic } from './phoneCallSlice';
import { handleVisiblePhoneCall } from 'features/contentChat/contentChatSlice';
const { Title, Text } = Typography;


const PhoneCall= () => {
  const isVisible = useAppSelector((state) => state.contentChat.isVisiblePhoneCall)
  const dispatch = useAppDispatch();
  const onMic = useAppSelector((state) => state.phoneCall.onMic);
  const onCam = useAppSelector((state) => state.phoneCall.onCam);

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
          <Space direction="vertical" size="large" style={{ transform: 'translateY(90px)' }}>
            <Avatar className="phone-call__caller__avatar" size={128} icon={<UserOutlined />} />
            <Space direction="vertical" size="small">
              <Title style={{ margin: 0, color: 'white' }} level={3}>
                Johan Smith
              </Title>
              <Text type="secondary" style={{ color: '#dedede' }}>
                0833495422
              </Text>
            </Space>
          </Space>
        </div>
        <div className="phone-call__controller">
          <Space size="large">
            {onCam ? (
              <Tooltip title="Turn off camera">
                <Button
                  size="large"
                  shape="circle"
                  icon={<VideoCameraOutlined style={{ color: 'black' }} />}
                  onClick={() => {
                    dispatch(handleCam());
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Share camera">
                <Button
                  size="large"
                  type="link"
                  shape="circle"
                  icon={<VideoCameraOutlined style={{ color: 'white' }} />}
                  onClick={() => {
                    dispatch(handleCam());
                  }}
                />
              </Tooltip>
            )}

            <Tooltip title="Hang up">
              <Button
                type="primary"
                size="large"
                danger
                shape="circle"
                icon={<PoweroffOutlined />}
                onClick={() => {dispatch(handleVisiblePhoneCall(false))}}
              />
            </Tooltip>

            {onMic ? (
              <Tooltip title="Turn off mic">
                <Button
                  size="large"
                  shape="circle"
                  icon={<AudioOutlined style={{ color: 'black' }} />}
                  onClick={() => {
                    dispatch(handleMic());
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Turn on mic">
                <Button
                  size="large"
                  type="link"
                  shape="circle"
                  icon={<AudioOutlined style={{ color: 'white' }} />}
                  onClick={() => {
                    dispatch(handleMic());
                  }}
                />
              </Tooltip>
            )}
          </Space>

          {/* <BeforeCall /> */} 
          {/* <WaitingCall /> */} 
        </div>
      </div>
    </Modal>
  );
};

const BeforeCall = () => {
  return (
    <div className="before-call">
      <Button
        type="primary"
        size="large"
        shape="circle"
        icon={<PhoneOutlined />}
        style={{ backgroundColor: '#26db26', borderColor: '#26db26' }}
      />
      <Button type="primary" size="large" danger shape="circle" icon={<PoweroffOutlined />} />
    </div>
  );
};

const WaitingCall = () => {
  return (
    <Tooltip title="Hang up">
      <Button type="primary" size="large" danger shape="circle" icon={<PoweroffOutlined />} />
    </Tooltip>
  );
};

export default PhoneCall;
