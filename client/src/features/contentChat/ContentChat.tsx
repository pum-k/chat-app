import React, { useEffect, useRef } from 'react';
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
} from 'antd';
import {
  BellOutlined,
  SendOutlined,
  MessageOutlined,
  StopOutlined,
  PhoneFilled,
  VideoCameraFilled,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import moment from 'moment';
import { joinRoom, selectMessages, sendMessage, sendMessageAsync } from './contentChatSlice';
import './ContentChat.scss';
import { io } from 'socket.io-client';

const { Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const ContentChat = () => {
  // REDUX--------------------------->
  // -> Declare
  const dispatch = useAppDispatch();

  // -> Fetch data
  // ????

  // -> get store messages
  const messages = useAppSelector(selectMessages);

  // -> handle send message
  const onFinish = (value: any) => {
    form.resetFields();
    const newMessage = {
      create_at: Date.now(),
      line_text: value.message,
      user_name: 'test',
      // id: 'test',
      // room_id: 'test',
    };
    dispatch(sendMessageAsync(newMessage));
  };
  // <---------------------------REDUX

  // AUTO SCROLL LASTED MESSAGE----------->
  const messagesEndRef = useRef<any>(null);
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  // <-----------AUTO SCROLL LASTED MESSAGE

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
  const socket = io('http://localhost:4000'); // Declare socket
  useEffect(() => {
    dispatch(joinRoom(socket)); // Join room by id_room

    // -> when send message
    socket.on('newMessages', (data: any) => {
      const newMessage = {
        create_at: data.create_at,
        line_text: data.message,
        user_name: data.user_name,
      };
      dispatch(sendMessage(newMessage));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // <-----------------------------SOCKET.IO

  return (
    <div className="content-chat">
      <section className="content-chat__2nd">
        <div className="content-chat__2nd__header">
          <section className="content-chat__2nd__header__infor">
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
          <section className="content-chat__2nd__header__feature">
            <Space size="large">
              <Tooltip title="Call now">
                <PhoneFilled style={{ fontSize: '26px', cursor: 'pointer', color: '#f857a6' }} />
              </Tooltip>
              <Tooltip title="Video call">
                <VideoCameraFilled
                  style={{ fontSize: '26px', cursor: 'pointer', color: '#f857a6' }}
                />
              </Tooltip>
            </Space>
          </section>
        </div>
        <div className="content-chat__2nd__chat-box">
          {messages &&
            messages.map((item, index) => {
              if (item.user_name !== 'owner')
                return (
                  <Comment
                    style={{ width: '40%' }}
                    key={index}
                    actions={[]}
                    author={<b>{item.user_name}</b>}
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
              else
                return (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Space direction="vertical" style={{ width: '40%', alignItems: 'flex-end' }}>
                      <Space>
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                          <span style={{ color: '#ccc', fontSize: '12px' }}>
                            {moment().fromNow()}
                          </span>
                        </Tooltip>
                        <b style={{ color: '#00000073', fontSize: '12px' }}>{item.user_name}</b>
                      </Space>
                      <p style={{ textAlign: 'right' }}>{item.line_text}</p>
                    </Space>
                  </div>
                );
            })}
          <div ref={messagesEndRef} />
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
                <TextArea
                  placeholder="Chat now..."
                  autoSize={{ maxRows: 3 }}
                  onKeyPress={(e: any) => {
                    chatEnterSubmit(e);
                  }}
                  autoFocus
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
            <button className="content-chat__3th__btn">
              <BellOutlined />
              <p>Turn off the chat</p>
            </button>
            <button className="content-chat__3th__btn">
              <MessageOutlined /> <p>Ignore the message</p>
            </button>
            <button className="content-chat__3th__btn">
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
  );
};

export default ContentChat;
