import AccountModal from 'features/accountModal/AccountModal';
import { Menu, Avatar, Badge, Image, Space, Typography, Dropdown, Button, Spin } from 'antd';
import { MoreOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './HeaderChat.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchUser, selectHeaderChatLoading, selectUser } from './headerChatSlice';

const { Title } = Typography;

const HeaderChat = () => {
  const [isModalVisibleAccount, setIsModalVisibleAccount] = useState(false);
  const dispatch = useAppDispatch();
  const showModalAccount = () => {
    setIsModalVisibleAccount(true);
  };

  const handleOkAccount = () => {
    setIsModalVisibleAccount(false);
  };

  const handleCancelAccount = () => {
    setIsModalVisibleAccount(false);
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const InfoUser = useAppSelector(selectUser);
  const loading = useAppSelector(selectHeaderChatLoading);

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
      <Spin spinning={loading} tip="Loading..." size="large">
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
                    <Image
                      src={InfoUser.user_avatar ? InfoUser.user_avatar : 'error'}
                      fallback="https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg"
                    />
                  }
                  style={{ border: '1px solid #fff' }}
                />
              </Badge>
              <section>
                <Title level={5} style={{ marginBottom: '0px', color: 'white' }}>
                  {InfoUser.user_name}
                </Title>
                <Badge color={'#54ff00'} text={'Available'} style={{ color: '#fff' }} />
              </section>
              <Dropdown overlay={menu} trigger={['click']}>
                <MoreOutlined style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
              </Dropdown>
            </Space>
          </Space>
        </div>
      </Spin>
    </>
  );
};

export default HeaderChat;
