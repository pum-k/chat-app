import React, { useState } from 'react';
import AddFriendModal from 'features/addFriendModal/AddFriendModal';
import CreateGroup from 'features/createGroup/CreateGroup';
import { Avatar, Badge, Space, List, Tooltip, Button, Input } from 'antd';
import { UsergroupAddOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './SiderChat.scss';

const { Search } = Input;

const SiderChat = () => {
  const data = [
    {
      id: '123121233',
      title: 'Duong Dang Khoa',
    },
    {
      id: '1231204',
      title: 'Duong Huu Thang',
    },
  ];

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

  const [isModalVisibleCreateGroup, setIsModalVisibleCreateGroup] = useState(false);

  const showModalCreateGroup = () => {
    setIsModalVisibleCreateGroup(true);
  };

  const handleOkCreateGroup = () => {
    setIsModalVisibleCreateGroup(false);
  };

  const handleCancelCreateGroup = () => {
    setIsModalVisibleCreateGroup(false);
  };

  const onSearch = (value: any) => {
    console.log(value);
  };

  return (
    <>
      <AddFriendModal
        isModalVisible={isModalVisibleAddFriend}
        setIsModalVisible={setIsModalVisibleAddFriend}
        handleOk={handleOkAddFriend}
        handleCancel={handleCancelAddFriend}
      />
      <CreateGroup
        isModalVisible={isModalVisibleCreateGroup}
        setIsModalVisible={setIsModalVisibleCreateGroup}
        handleOk={handleOkCreateGroup}
        handleCancel={handleCancelCreateGroup}
      />
      <section className="sider-chat">
        <div className="sider-chat__header">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            className="sider-chat__header__search"
            size="large"
            enterButton
          />
          <Space>
            <Tooltip title="Add friend">
              <Button
                type="text"
                shape="circle"
                icon={<UserAddOutlined />}
                onClick={() => showModalAddFriend()}
              />
            </Tooltip>

            <Tooltip title="Add group chat">
              <Button
                type="text"
                shape="circle"
                icon={<UsergroupAddOutlined />}
                onClick={() => showModalCreateGroup()}
              />
            </Tooltip>
          </Space>
        </div>
        <div className="sider-chat__list-chater">
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <Link to={`/t/${item.id}`} style={{ width: '100%', height: '100%', display: 'flex' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={<p>{item.title}</p>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team, Ant Design, a design language for background applications, is refined by Ant UED Team Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                  <Badge count={1} style={{ marginLeft: '1rem' }} />
                </Link>
              </List.Item>
            )}
          />
        </div>
      </section>
    </>
  );
};

export default SiderChat;
