import React, { useEffect, useState } from 'react';
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
import { io } from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { messageStructure } from 'constants/ChatTypes';
const { Title } = Typography;
const { Panel } = Collapse;
const socket = io('http://localhost:4000');
const ContentChat = () => {
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
      // dispatch(renderMessageAsync());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // <-----------------------------SOCKET.IO

  // UPLOAD IMG------------------------------->
  const [imageUrl, setImageUrl] = useState();

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const dummyRequest = ({ file, onSuccess }: any) => {
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
          type: 'img',
        };

        dispatch(sendImage(newMessage));
      });
    }
  };

  // -> check share media have image or not
  const [flagimg, setFlagimg] = useState(false);
  // <----------------------------------UPLOAD IMG

  // BLOCK USER ------------------------>
  const isBlockUser = true;
  // <------------------------ BLOCK USER

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
                if (item.type === 'img')
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
                      content={
                        <img style={{ maxWidth: '1135px' }} src={item.line_text} alt="upload" />
                      }
                      datetime={
                        <Tooltip title={moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')}>
                          <span>{moment(item.createAt).fromNow()}</span>
                        </Tooltip>
                      }
                    />
                  );
                else
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
                  disabled={isBlockUser}
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
                      disabled={isBlockUser}
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
            <button className="content-chat__3th__btn" disabled={isBlockUser}>
              <BellOutlined />
              <p>Block user</p>
            </button>
            <button className="content-chat__3th__btn">
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
                if (item.type === 'img') {
                  if (!flagimg) setFlagimg(true);
                  return (
                    <Col className="gutter-row" span={8}>
                      <Image width={75} height={75} src={item.line_text} />
                    </Col>
                  );
                }
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
