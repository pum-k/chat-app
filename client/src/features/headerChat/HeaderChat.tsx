import AccountModal from 'features/accountModal/AccountModal';
import { Menu, Avatar, Badge, Image, Space, Typography, Dropdown, Button } from 'antd';
import { MoreOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import './HeaderChat.scss';

const { Title } = Typography;

const HeaderChat = () => {
  const [isModalVisibleAccount, setIsModalVisibleAccount] = useState(false);
  const showModalAccount = () => {
    setIsModalVisibleAccount(true);
  };

  const handleOkAccount = () => {
    setIsModalVisibleAccount(false);
  };

  const handleCancelAccount = () => {
    setIsModalVisibleAccount(false);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" icon={<UserOutlined />} onClick={() => showModalAccount()}>
          Account
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type="link"
          danger
          icon={<LogoutOutlined />}
          onClick={() => {
            localStorage.removeItem('access_token');
            window.location.reload();
          }}
        >
          Sign out
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <AccountModal
        isModalVisible={isModalVisibleAccount}
        setIsModalVisible={setIsModalVisibleAccount}
        handleOk={handleOkAccount}
        handleCancel={handleCancelAccount}
      />
      <div className="header-chat">
        <Title level={2} style={{ marginBottom: '0px', color: 'white' }}>
          Chat App
        </Title>
        <Space>
          <Space size="large">
            <Badge count={1} offset={[-5, 5]}>
              <Avatar
                size={50}
                src={
                  <Image src="https://s120-ava-talk.zadn.vn/d/9/9/1/6/120/b1c672818fc133d72cb8685a850c578c.jpg" />
                }
                style={{ border: '1px solid #fff' }}
              />
            </Badge>
            <section>
              <Title level={5} style={{ marginBottom: '0px', color: 'white' }}>
                Display name
              </Title>
              <Badge color={'#54ff00'} text={'Available'} style={{ color: '#fff' }} />
            </section>
            <Dropdown overlay={menu} trigger={['click']}>
              <MoreOutlined style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Space>
      </div>
    </>
  );
};

export default HeaderChat;
