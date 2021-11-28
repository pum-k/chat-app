import AccountModal from 'features/accountModal/AccountModal';
import { Menu, Avatar, Badge, Image, Space, Typography, Dropdown, Button, Spin } from 'antd';
import { MoreOutlined, UserOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import './HeaderChat.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectUserModal, selectUserUpdate } from 'features/accountModal/accountModalSlice';
import {
  acceptRequest,
  denyRequest,
  fetchListPending,
  fetchListRequest,
  removeRequest,
} from './headerChatSlice';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import AddFriendModal from 'features/addFriendModal/AddFriendModal';
import { Socket } from 'socket.io-client';

const { Title, Text } = Typography;

const HeaderChat: FC<{ socket: Socket<DefaultEventsMap, DefaultEventsMap> }> = ({ socket }) => {
  useEffect(() => {
    socket.on('addFriendRequest', () => {
      dispatch(fetchListRequest());
    });
    socket.on('acceptAddFriend', (data: any) => {
      console.log(data);
    });
  });

  const dispatch = useAppDispatch();

  const avatarUrl = useAppSelector((state) => state.headerChat.avatar);

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

  const [isModalVisibleAddFriend, setIsModalVisibleAddFriend] = useState(false);

  const showModalAddFriend = () => {
    setIsModalVisibleAddFriend(true);
  };

  const handleOkAddFriend = () => {
    setIsModalVisibleAddFriend(false);
  };

  const handleCancelAddFriend = () => {
    setIsModalVisibleAddFriend(false);
  };

  const InfoUser = useAppSelector(selectUserModal);
  const loading = useAppSelector(selectUserUpdate);

  const listRequest: Array<{
    avatar: string;
    phoneNumber: string;
    username: string;
    displayName: string;
  }> = useAppSelector((state) => state.headerChat.listRequest);
  const listPending: Array<{
    avatar: string;
    phoneNumber: string;
    username: string;
    displayName: string;
  }> = useAppSelector((state) => state.headerChat.listPending);
  useEffect(() => {
    dispatch(fetchListRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [numberOfNotifications, setNumberOfNotifications] = useState(0);
  useEffect(() => {
    if (listPending.length > 0 || listRequest.length > 0)
      setNumberOfNotifications(listPending.length + listRequest.length);
  }, [listRequest, listPending]);

  const offNumberOfNotifications = () => {
    if (numberOfNotifications !== 0) setNumberOfNotifications(0);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" icon={<UserAddOutlined />} onClick={() => showModalAddFriend()}>
          Add new friend
        </Button>
      </Menu.Item>
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
            window.location.href="http://localhost:3000/login";
          }}
        >
          Sign out
        </Button>
      </Menu.Item>
    </Menu>
  );

  const menuNotification = (
    <Menu>
      {listRequest &&
        listRequest.map((item, index) => {
          return (
            <Menu.Item>
              <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Avatar src={item.avatar} icon={<UserOutlined />} />
                  <Text>
                    <b>{item.displayName || item.username}</b> wants to be friends with you
                  </Text>
                </Space>
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      dispatch(acceptRequest(item.phoneNumber));
                      dispatch(removeRequest(index));
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      dispatch(denyRequest(item.phoneNumber));
                      dispatch(removeRequest(index));
                    }}
                  >
                    Deny
                  </Button>
                </Space>
              </Space>
            </Menu.Item>
          );
        })}
    </Menu>
  );

  return (
    <>
      <AddFriendModal
        isModalVisible={isModalVisibleAddFriend}
        setIsModalVisible={setIsModalVisibleAddFriend}
        handleOk={handleOkAddFriend}
        handleCancel={handleCancelAddFriend}
      />
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
              <Dropdown
                overlay={menuNotification}
                trigger={['click']}
                disabled={listRequest.length === 0}
              >
                <div onClick={() => offNumberOfNotifications()}>
                  <Badge count={numberOfNotifications} offset={[-5, 5]}>
                    <Avatar
                      size={50}
                      src={
                        <Image
                          preview={false}
                          src={avatarUrl || InfoUser.user_avatar || 'error'}
                          fallback="https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
                        />
                      }
                      style={{ border: '1px solid #fff', cursor: 'pointer' }}
                    />
                  </Badge>
                </div>
              </Dropdown>
              <section>
                <Title level={5} style={{ marginBottom: '0px', color: 'white' }}>
                  {InfoUser.user_display_name || InfoUser.user_name}
                </Title>
                <Badge color={'#54ff00'} text={'Online'} style={{ color: '#fff' }} />
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
