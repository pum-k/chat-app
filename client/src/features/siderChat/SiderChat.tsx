import { FC, useEffect, useState } from 'react';
import AddFriendModal from 'features/addFriendModal/AddFriendModal';
import { Avatar, Space, List, Tooltip, Button, Typography, Empty } from 'antd';
import { UserOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './SiderChat.scss';
import { fetchListRoom, selectListRoom, selectListRoomLoading } from './siderChatSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'app/hooks';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

interface Props {
  onLoading: () => void;
  offLoading: () => void;
}

const SiderChat: FC<Props> = (props) => {
  const history = useHistory();
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
      <section className="sider-chat">
        <div className="sider-chat__list-chater">
          {rooms.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={rooms}
              renderItem={(item, index) => (
                <List.Item>
                  {index === 0 && history.push(`/t/${item.room_id}`)}
                  <Link
                    to={`/t/${item.room_id}`}
                    style={{ width: '100%', height: '100%', display: 'flex' }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item.avatar || 'error'}
                          icon={!item.avatar && <UserOutlined />}
                        />
                      }
                      title={<p>{`${item.displayName}`}</p>}
                      description={
                        item.last_message ? (
                          <Space>
                            <p
                              style={{
                                maxWidth: '165px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.last_message}
                            </p>
                            <p>• {item.time}</p>
                          </Space>
                        ) : (
                          `Say hello to ${item.displayName} now!`
                        )
                      }
                    />
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
