import { Button, Space, Tooltip } from 'antd';
import React, { FC, useEffect } from 'react';
import { VideoCameraOutlined, PoweroffOutlined, AudioOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { hangUpCall } from 'features/contentChat/contentChatSlice';
import { useAppSelector } from 'app/hooks';
import { handleOnCam, handleOnMic, setCam, setMic } from './inCallSlice';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
const InCall: FC<{
  MyVideo: MediaStream | undefined;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}> = ({ MyVideo, socket }) => {
  const onCam = useAppSelector((state) => state.inCall.onCam);
  const onMic = useAppSelector((state) => state.inCall.onMic);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      if (MyVideo) dispatch(handleOnMic(MyVideo));
    } catch (e) {
      console.log('chua set up');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMic]);

  useEffect(() => {
    try {
      if (MyVideo) dispatch(handleOnCam(MyVideo));
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCam]);

  const hangUp = () => {
    let video = document.querySelector('video');
    if (video) {
      let stream: MediaStream = video.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
      }
      video.srcObject = null;
      dispatch(hangUpCall());
    }
    socket.emit('closeCall', {
      owner: localStorage.getItem('access_token'),
      currentRoom: localStorage.getItem('room_id'),
    });
  };

  return (
    <Space size="large">
      {onCam ? (
        <Tooltip title="Turn off camera">
          <Button
            onClick={() => dispatch(setCam(false))}
            size="large"
            shape="circle"
            icon={<VideoCameraOutlined style={{ color: 'black' }} />}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Share camera">
          <Button
            onClick={() => dispatch(setCam(true))}
            size="large"
            type="link"
            danger
            shape="circle"
            icon={<VideoCameraOutlined />}
          />
        </Tooltip>
      )}

      <Tooltip title="Hang up">
        <Button
          onClick={() => {
            hangUp();
          }}
          type="primary"
          size="large"
          danger
          shape="circle"
          icon={<PoweroffOutlined />}
        />
      </Tooltip>

      {onMic ? (
        <Tooltip title="Turn off mic">
          <Button
            onClick={() => dispatch(setMic(false))}
            size="large"
            shape="circle"
            icon={<AudioOutlined style={{ color: 'black' }} />}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Turn on mic">
          <Button
            onClick={() => dispatch(setMic(true))}
            size="large"
            type="link"
            danger
            shape="circle"
            icon={<AudioOutlined />}
          />
        </Tooltip>
      )}
    </Space>
  );
};

export default InCall;
