import React, { FC, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Image,
  Comment,
  Space,
  Typography,
  Tooltip,
  Collapse,
  Button,
  Empty,
  Form,
  Input,
  Divider,
  Skeleton,
  Upload,
  Row,
  Col,
  message,
} from 'antd';
import {
  BellOutlined,
  SendOutlined,
  StopOutlined,
  PhoneFilled,
  UserOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import moment from 'moment';
import {
  joinRoom,
  renderMessageAsync,
  selectMessages,
  sendImage,
  sendMessageAsync,
} from './contentChatSlice';
import './ContentChat.scss';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { messageStructure } from 'constants/ChatTypes';
// import {
//   blockUserAsync,
//   fetchListRoom,
//   unBlockUserAsync,
//   unFriendAsync,
//   updateBlock,
// } from 'features/siderChat/siderChatSlice';
import { userApi } from 'api/userApi';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { blockUserAsync, unBlockUserAsync, unFriendAsync } from 'features/siderChat/siderChatSlice';
const { Title } = Typography;
const { Panel } = Collapse;
const ContentChat: FC<{ socket: Socket<DefaultEventsMap, DefaultEventsMap> }> = (props) => {
  const { socket } = props;

  // REDUX--------------------------->
  // -> Declare
  const dispatch = useAppDispatch();

  // -> Fetch data
  let location = useLocation();
  const roomId = location.pathname.slice(3);
  useEffect(() => {
    localStorage.setItem('room_id', roomId);
    dispatch(joinRoom(socket)); // Join room by id_room
    dispatch(renderMessageAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // -> get store messages
  const messages = useAppSelector(selectMessages);
  // -> Info chat box
  const owner = useAppSelector((state) => state.accountModal.user);
  const owner_avatar = useAppSelector((state) => state.headerChat.avatar);
  const your_friend = useAppSelector((state) => state.siderChat.data).filter(
    (item) => item.room_id === roomId
  );
  // -> handle send message
  const onFinish = (value: any) => {
    form.resetFields();
    if (value.message.match(/[a-z]/i)) {
      const newMessage = {
        createAt: Date.now(),
        line_text: value.message,
        user_name: localStorage.getItem('access_token') || '',
      };
      dispatch(sendMessageAsync(newMessage));
    }
  };
  // <---------------------------REDUX

  // Load more---------------------------------->
  const [elementTh, setElementTh] = useState(11);
  const [hasMoreLoad, setHasMoreLoad] = useState(true);
  const [messRender, setMessRender] = useState<Array<messageStructure>>();

  const handleLoadMore = async () => {
    if (Number(messages.length) > Number(elementTh + 11)) {
      setTimeout(() => {
        setElementTh(Number(elementTh + 11));
        setMessRender([...messages].reverse().splice(0, Number(elementTh + 11)));
      }, 1000);
    } else {
      setTimeout(() => {
        setMessRender([...messages].reverse());
        setHasMoreLoad(false);
      }, 1000);
    }
  };

  // when send a new message
  useEffect(() => {
    if (messages) {
      setMessRender([...messages].reverse().splice(0, Number(elementTh)));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (messRender && messRender.length < 11) {
      setHasMoreLoad(false);
    } else {
      setHasMoreLoad(true);
    }
  }, [messRender]);

  // <---------------------------------Load more
  // HANDLE SEND MESSAGE------------------>
  const [form] = Form.useForm(); // This form of antd
  // -> When send message by "enter" or click button
  const chatEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === 'Enter' && e.shiftKey === false) {
      onFinish({ message: target.value });
      e.preventDefault();
    }
  };
  // <------------------HANDLE SEND MESSAGE

  // SOCKET.IO----------------------------->

  useEffect(() => {
    // -> when new message
    socket.on('newMessages', () => {
      dispatch(renderMessageAsync());
      // dispatch(fetchListRoom());
    });
    socket.on('addFriendRequest', (data: any) => {
      console.log(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // <-----------------------------SOCKET.IO

  // UPLOAD IMG------------------------------->

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const dummyRequest = ({ file, onSuccess }: any) => {
    let data = new FormData();
    data.append('file', file);
    data.append('id', localStorage.getItem('access_token') || '');
    data.append('room_id', roomId);
    userApi.sendImage(data);
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const handleChangeUpload = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        const newMessage: messageStructure = {
          createAt: Date.now(),
          line_text: String(imageUrl),
          user_name: 'You',
          type: 'image',
        };
        dispatch(sendImage(newMessage));
      });
    }
  };

  // -> check share media have image or not
  const [flagimg, setFlagimg] = useState(false);
  // <----------------------------------UPLOAD IMG

  // BLOCK USER ------------------------>

  const isBlockUser = useAppSelector(
    (state) => state.siderChat.data.filter((item) => item.room_id === roomId)[0].isBlock
  );
  const handleBlockUser = () => {
    const params = {
      owners: localStorage.getItem('access_token'),
      room_id: roomId,
    };
    if (!isBlockUser) {
      // dispatch(blockUserAsync(params));
    } else {
      // dispatch(unBlockUserAsync(params));
    }
  };
  // <------------------------ BLOCK USER

  // Real-time moment ------------------->
  const [time, setTime] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      dispatch(renderMessageAsync());
      // dispatch(fetchListRoom());
      setTime(!time);
    }, 60000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);
  // <--------------------------Real-time moment

  // Unfriend --------------------->
  const siderData = useAppSelector((state) => state.siderChat.data);
  const handleUnfriend = () => {
    const owners = localStorage.getItem('access_token');
    const nameUnfriend = siderData.filter((item) => item.room_id === roomId)[0].friend_name;
    const params = {
      owners,
      nameUnfriend,
    };

    // dispatch(unFriendAsync(params));
  };
  // <----------------------- Unfriend

  return (
    <div className="content-chat">
      <section className="content-chat__2nd">
        <div className="content-chat__2nd__header">
          <section className="content-chat__2nd__header__infor">
            <Space>
              <Avatar
                size={40}
                src={
                  <Image
                    src={your_friend[0].avatar ? your_friend[0].avatar : 'error'}
                    fallback="https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
                  />
                }
              />
              <Title level={5} style={{ margin: '0' }}>
                {your_friend[0].displayName}
              </Title>
              <Badge color={'red'} text={'Offline'} size="small" />
            </Space>
          </section>
          <section className="content-chat__2nd__header__feature">
            <Tooltip title="Call now">
              <PhoneFilled style={{ fontSize: '26px', cursor: 'pointer', color: '#f857a6' }} />
            </Tooltip>
          </section>
        </div>
        <div className="content-chat__2nd__chat-box" id="scrollableDiv">
          <InfiniteScroll
            dataLength={messRender ? messRender.length : 0}
            next={handleLoadMore}
            style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
            inverse={true}
            hasMore={hasMoreLoad}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            {messRender && messRender.length > 0 && messRender[0] !== undefined ? (
              messRender.map((item, index) => {
                if (item.type === 'image')
                  return (
                    <Comment
                      style={{ width: '100%' }}
                      key={index}
                      actions={[]}
                      author={<b>{item.user_name === owner.user_name ? 'You' : item.user_name}</b>}
                      avatar={
                        <Avatar
                          src={item.user_name === owner.user_name ? owner_avatar : item.avatar}
                          icon={!owner_avatar || !item.avatar ? <UserOutlined /> : null}
                        />
                      }
                      content={<Image width={300} src={item.line_text} />}
                      datetime={
                        <Tooltip title={moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')}>
                          <span>{moment(item.createAt).fromNow()}</span>
                        </Tooltip>
                      }
                    />
                  );
                else if (item.type === 'text')
                  return (
                    <Comment
                      style={{ width: '100%' }}
                      key={index}
                      actions={[]}
                      author={<b>{item.user_name === owner.user_name ? 'You' : item.user_name}</b>}
                      avatar={
                        <Avatar
                          src={
                            item.user_name === owner.user_name
                              ? owner_avatar || owner.user_avatar
                              : your_friend[0].avatar
                          }
                          icon={<UserOutlined />}
                        />
                      }
                      content={<p>{item.line_text}</p>}
                      datetime={
                        <Tooltip title={moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')}>
                          <span>{moment(item.createAt).fromNow()}</span>
                        </Tooltip>
                      }
                    />
                  );
              })
            ) : (
              <div>
                <Title level={1}>Now you two are friends</Title>
                <Title level={3}>Let's text each other!</Title>
              </div>
            )}
          </InfiniteScroll>
        </div>
        <div className="content-chat__2nd__input">
          <Form
            name="chat"
            autoComplete="off"
            onFinish={onFinish}
            form={form}
            className="content-chat__2nd__input__form"
          >
            <Space size="small" style={{ width: '100%' }}>
              <Form.Item name="message" style={{ width: '100%' }}>
                <Input
                  size="large"
                  placeholder={
                    isBlockUser
                      ? "You have been blocked by this user. You can't text now!"
                      : 'Chat now...'
                  }
                  disabled={Boolean(isBlockUser)}
                  onKeyPress={(e: any) => {
                    chatEnterSubmit(e);
                  }}
                  autoFocus
                  maxLength={200}
                  suffix={
                    <Upload
                      name="image"
                      showUploadList={false}
                      customRequest={dummyRequest}
                      onChange={handleChangeUpload}
                      disabled={Boolean(isBlockUser)}
                      beforeUpload={beforeUpload}
                    >
                      <FileImageOutlined />
                    </Upload>
                  }
                />
              </Form.Item>
              <Form.Item>
                <Tooltip placement="top" title={`Send`}>
                  <Button
                    shape="circle"
                    icon={<SendOutlined />}
                    type="primary"
                    size="large"
                    className="content-chat__2nd__input__btn-send"
                    htmlType="submit"
                  />
                </Tooltip>
              </Form.Item>
            </Space>
          </Form>
        </div>
      </section>
      <section className="content-chat__3th">
        <Collapse expandIconPosition="right">
          <Panel header="Privacy settings" key="1">
            <button
              className={
                !isBlockUser
                  ? 'content-chat__3th__btn'
                  : 'content-chat__3th__btn content-chat__3th__btn--block'
              }
              onClick={handleBlockUser}
            >
              <BellOutlined />
              <p>{!isBlockUser ? 'Block user' : 'Unblock user'}</p>
            </button>
            <button className="content-chat__3th__btn" onClick={handleUnfriend}>
              <StopOutlined />
              <p>Unfriend this user</p>
            </button>
          </Panel>
          <Panel
            header="Shared media"
            key="2"
            style={{ height: 'auto', maxHeight: '760px', overflow: 'auto' }}
          >
            <Row justify="start">
              {messages.map((item) => {
                if (item.type === 'image') {
                  if (!flagimg) setFlagimg(true);
                  return (
                    <Col className="gutter-row" span={8}>
                      <Image width={75} height={75} src={item.line_text} />
                    </Col>
                  );
                } else return null;
              })}
              {!flagimg && <Empty style={{ margin: '0 auto' }} />}
            </Row>
          </Panel>
        </Collapse>
      </section>
    </div>
  );
};

export default ContentChat;
