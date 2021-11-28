import { FC, useEffect, useState } from 'react';
import AddFriendModal from 'features/addFriendModal/AddFriendModal';
import { Avatar, Space, List, Button, Empty, Badge, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './SiderChat.scss';
import {
  fetchListRoom,
  increaseNumberNotSeen,
  removeNotSeen,
  selectListRoom,
} from './siderChatSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'app/hooks';
import { useHistory } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
const { Text } = Typography;

const SiderChat: FC<{ socket: Socket<DefaultEventsMap, DefaultEventsMap> }> = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const rooms = useAppSelector(selectListRoom);

  const [isModalVisibleAddFriend, setIsModalVisibleAddFriend] = useState(false);

  useEffect(() => {
    socket.on('newMessageComming', (data: any) => {
      dispatch(increaseNumberNotSeen(data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
                <List.Item onClick={() => dispatch(removeNotSeen(item.room_id))}>
                  {index === 0 &&
                    history.location.pathname.length < 3 &&
                    history.push(`/t/${item.room_id}`)}
                  <Link
                    to={`/t/${item.room_id}`}
                    style={{ width: '100%', height: '100%', display: 'flex' }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge count={item.numberNotSeen}>
                          <Avatar
                            style={{ border: '1px solid #999' }}
                            shape="circle"
                            src={item.avatar || 'error'}
                            icon={!item.avatar && <UserOutlined />}
                          />
                        </Badge>
                      }
                      title={<Text strong>{`${item.displayName}`}</Text>}
                      description={
                        item.last_message ? (
                          <Space>
                            <p
                              style={{
                                maxWidth: '145px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.last_message.slice(-3) === 'png' ? item.last_message.slice(0, item.last_message.indexOf(":")+1) + ' image' : item.last_message}
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
