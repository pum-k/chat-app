import { Button, Space, Tooltip } from 'antd';
import React from 'react';
import { VideoCameraOutlined, PoweroffOutlined, AudioOutlined } from '@ant-design/icons';
const InCall = () => {
  const onCam = false;
  const onMic = false;

  return (
    <Space size="large">
      {onCam ? (
        <Tooltip title="Turn off camera">
          <Button
            size="large"
            shape="circle"
            icon={<VideoCameraOutlined style={{ color: 'black' }} />}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Share camera">
          <Button
            size="large"
            type="link"
            shape="circle"
            icon={<VideoCameraOutlined style={{ color: 'white' }} />}
          />
        </Tooltip>
      )}

      <Tooltip title="Hang up">
        <Button type="primary" size="large" danger shape="circle" icon={<PoweroffOutlined />} />
      </Tooltip>

      {onMic ? (
        <Tooltip title="Turn off mic">
          <Button size="large" shape="circle" icon={<AudioOutlined style={{ color: 'black' }} />} />
        </Tooltip>
      ) : (
        <Tooltip title="Turn on mic">
          <Button
            size="large"
            type="link"
            shape="circle"
            icon={<AudioOutlined style={{ color: 'white' }} />}
          />
        </Tooltip>
      )}
    </Space>
  );
};

export default InCall;
