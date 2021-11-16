import { FC, useEffect, useState } from 'react';
import AddFriendModal from 'features/addFriendModal/AddFriendModal';
import CreateGroup from 'features/createGroup/CreateGroup';
import { Avatar, Badge, Space, List, Tooltip, Button, Input, Empty } from 'antd';
import { UsergroupAddOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './SiderChat.scss';
import { fetchListRoom, selectListRoom, selectListRoomLoading } from './siderChatSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'app/hooks';

const { Search } = Input;

interface Props {
  onLoading: () => void;
  offLoading: () => void;
}

const SiderChat: FC<Props> = (props) => {
  const { onLoading, offLoading } = props;
  const dispatch = useDispatch();
  const rooms = useAppSelector(selectListRoom);

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

  useEffect(() => {
    dispatch(fetchListRoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisibleAddFriend]);
  const loading = useAppSelector(selectListRoomLoading);
  useEffect(() => {
    if (loading) {
      onLoading();
    } else {
      offLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
          {rooms.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={rooms}
              renderItem={(item) => (
                <List.Item>
                  <Link
                    to={`/t/${item.room_id}`}
                    style={{ width: '100%', height: '100%', display: 'flex' }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={<p>{item.friend_name}</p>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team, Ant Design, a design language for background applications, is refined by Ant UED Team Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                    <Badge count={1} style={{ marginLeft: '1rem' }} />
                  </Link>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              style={{ marginTop: '1rem' }}
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={<span>You haven't chated anyone yet</span>}
            >
              <Button type="primary" onClick={() => setIsModalVisibleAddFriend(true)}>
                Add friend and chat now
              </Button>
            </Empty>
          )}
        </div>
      </section>
    </>
  );
};

export default SiderChat;
