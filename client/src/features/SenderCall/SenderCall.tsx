import { Avatar, Button, Modal, Space, Tooltip, Typography } from 'antd';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FC, useRef, useEffect, useState } from 'react';
import { handleVisiblePhoneCall, hangUpCall } from 'features/contentChat/contentChatSlice';
import InCall from 'features/InCall/InCall';
import { RoomChatRender } from 'constants/SiderChatTypes';
const { Title, Text } = Typography;
const SenderCall: FC<{ peer: any, receiver: RoomChatRender | undefined}> = ({ peer, receiver }) => {
  const isVisible = useAppSelector((state) => state.contentChat.isVisibleSender);
  const MyVideo = useRef<any>();
  const dispatch = useAppDispatch();
  const isCallNow = useAppSelector((state) => state.contentChat.isVisiblePhoneCall);
  const [ minutes, setMinutes ] = useState(0);
    const [seconds, setSeconds ] =  useState(0);
    useEffect(() => {
        if(seconds === 60){
            setMinutes(minutes+1);
            setSeconds(0);
        }
        const interval = setInterval(() => {
            setSeconds(seconds + 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [minutes, seconds])

    console.log(minutes, seconds);
  
  useEffect(() => {
    peer.on('call', (call: any) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream: any) => {
          dispatch(handleVisiblePhoneCall(true));
          call.answer(stream);
          call.on('stream', (remoteStream: any) => {
            let newVideoRecieve = document.querySelectorAll('video');
            if (newVideoRecieve != null) {
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
          <video ref={MyVideo} autoPlay></video>

          <Space direction="vertical" size="large" style={{ transform: 'translateY(90px)' }}>
            <Avatar src={receiver && receiver.avatar} className="phone-call__caller__avatar" size={128} icon={<UserOutlined />} />
            <Space direction="vertical" size="small">
              <Title style={{ margin: 0, color: 'white' }} level={3}>
                {receiver ? receiver.displayName || receiver.friend_name : 'Not found'}
              </Title>
              <Text type="secondary" style={{ color: '#dedede' }}>
                {!isCallNow ? 'Waiting...' : `${minutes}:${seconds}`}
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
                onClick={() => dispatch(hangUpCall())}

              />
            </Tooltip>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SenderCall;
