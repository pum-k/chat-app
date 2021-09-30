import {
  Avatar,
  Badge,
  Image,
  Comment,
  Space,
  Typography,
  List,
  Tooltip,
  Collapse,
  Button,
  Empty,
  Menu,
  Dropdown,
  Input,
} from 'antd';
import React, { useRef, useState } from 'react';
import {
  MoreOutlined,
  BellOutlined,
  SendOutlined,
  MessageOutlined,
  StopOutlined,
  PhoneFilled,
  VideoCameraFilled,
  LogoutOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import './Chat.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';
import TextArea from 'rc-textarea';
import AccountModal from 'features/accountModal/AccountModal';
import AddFriendModal from 'features/addFriendModal/AddFriendModal';
import CreateGroup from 'features/createGroup/CreateGroup';

const { Title } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

const Chat = () => {
  // list item dropdown
  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" icon={<UserOutlined />} onClick={() => showModalAccount()}>
          Account
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="link" danger icon={<LogoutOutlined />}>
          Sign out
        </Button>
      </Menu.Item>
    </Menu>
  );

  //handle modal account
  const [isModalVisibleAccount, setIsModalVisibleAccount] = useState(false);
  const [isModalVisibleAddFriend, setIsModalVisibleAddFriend] = useState(false);
  const [isModalVisibleCreateGroup, setIsModalVisibleCreateGroup] = useState(false);
  const showModalAccount = () => {
    setIsModalVisibleAccount(true);
  };

  const handleOkAccount = () => {
    setIsModalVisibleAccount(false);
  };

  const handleCancelAccount = () => {
    setIsModalVisibleAccount(false);
  };

  const showModalAddFriend = () => {
    setIsModalVisibleAddFriend(true);
  };

  const handleOkAddFriend = () => {
    setIsModalVisibleAddFriend(false);
  };

  const handleCancelAddFriend = () => {
    setIsModalVisibleAddFriend(false);
  };

  const showModalCreateGroup = () => {
    setIsModalVisibleCreateGroup(true);
  };

  const handleOkCreateGroup = () => {
    setIsModalVisibleCreateGroup(false);
  };

  const handleCancelCreateGroup = () => {
    setIsModalVisibleCreateGroup(false);
  };

  // render chat-bubble
  const tempUser = useRef('');

  // list users to chat
  const data = [
    {
      id: '3119239adjawkd',
      title: 'Ant Design Title 1',
    },
    {
      id: '3119239adjawkd',
      title: 'Ant Design Title 1',
    },
  ];

  // list messages corresponding to each user
  const line_text = [
    {
      user_id: 'bahang',
      line_text: 'tao chui may do',
    },
    {
      user_id: 'bahang',
      line_text: 'con di cho',
    },
    {
      user_id: 'dvh',
      line_text: 'immom',
    },
    {
      user_id: 'dvh',
      line_text: 'immom',
    },
    {
      user_id: 'bahang',
      line_text: 'm lam sao',
    },
  ];

  // handle send messages
  const chatEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === 'Enter' && e.shiftKey === false) {
      console.log(target.value);
      target.value = '';
      e.preventDefault();
    }
  };

  //handle search
  const onSearch = (value: any) => {
    console.log(value);
  };

  return (
    <>
      <AccountModal
        isModalVisible={isModalVisibleAccount}
        setIsModalVisible={setIsModalVisibleAccount}
        handleOk={handleOkAccount}
        handleCancel={handleCancelAccount}
      />
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
      <div className="chat">
        <div className="chat__header">
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
        <div className="chat__content">
          <section className="chat__content__1st">
            <div className="chat__content__1st__header">
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                className="chat__content__1st__header__search"
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
            <div className="chat__content__1st__list-chater">
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <Link
                      to={`/${item.id}`}
                      style={{ width: '100%', height: '100%', display: 'flex' }}
                    >
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
          <section className="chat__content__2nd">
            <div className="chat__content__2nd__header">
              <section className="chat__content__2nd__header__infor">
                <Space>
                  <Avatar
                    size={40}
                    src={
                      <Image src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                  />
                  <Title level={5} style={{ margin: '0' }}>
                    My friend
                  </Title>
                  <Badge color={'red'} text={'Offline'} size="small" />
                </Space>
              </section>
              <section className="chat__content__2nd__header__feature">
                <Space size="large">
                  <Tooltip title="Call now">
                    <PhoneFilled
                      style={{ fontSize: '26px', cursor: 'pointer', color: '#f857a6' }}
                    />
                  </Tooltip>
                  <Tooltip title="Video call">
                    <VideoCameraFilled
                      style={{ fontSize: '26px', cursor: 'pointer', color: '#f857a6' }}
                    />
                  </Tooltip>
                </Space>
              </section>
            </div>
            <div className="chat__content__2nd__chat-box">
              {line_text
                .slice(0)
                .reverse()
                .map((item, index) => {
                  if (!tempUser.current) {
                    tempUser.current = item.user_id;
                    return (
                      <Comment
                        actions={[]}
                        author={<b>{item.user_id}</b>}
                        avatar={
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                          />
                        }
                        content={<p>{item.line_text}</p>}
                        datetime={
                          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                          </Tooltip>
                        }
                      />
                    );
                  } else if (item.user_id === tempUser.current) {
                    return (
                      <p style={{ marginLeft: '45px', marginBottom: '0px' }}>{item.line_text}</p>
                    );
                  } else {
                    tempUser.current = item.user_id;
                    return (
                      <Comment
                        actions={[]}
                        author={<b>{item.user_id}</b>}
                        avatar={
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                          />
                        }
                        content={<p>{item.line_text}</p>}
                        datetime={
                          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                          </Tooltip>
                        }
                      />
                    );
                  }
                })}
            </div>
            <div className="chat__content__2nd__input">
              <Space size="middle">
                <TextArea
                  placeholder="Chat now..."
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  onKeyPress={(e) => chatEnterSubmit(e)}
                />
                <Tooltip placement="top" title={`Send`}>
                  <Button
                    shape="circle"
                    icon={<SendOutlined />}
                    type="primary"
                    size="large"
                    className="chat__content__2nd__input__btn-send"
                  />
                </Tooltip>
              </Space>
            </div>
          </section>
          <section className="chat__content__3th">
            <Collapse expandIconPosition="right">
              <Panel header="Privacy settings" key="1">
                <button className="chat__content__3th__btn">
                  <BellOutlined />
                  <p>Turn off the chat</p>
                </button>
                <button className="chat__content__3th__btn">
                  <MessageOutlined /> <p>Ignore the message</p>
                </button>
                <button className="chat__content__3th__btn">
                  <StopOutlined />
                  <p>Block texting</p>
                </button>
              </Panel>
              <Panel header="Shared files" key="2">
                <Empty />
              </Panel>
              <Panel header="Shared media" key="3">
                <Empty />
              </Panel>
            </Collapse>
          </section>
        </div>
      </div>
    </>
  );
};

export default Chat;
