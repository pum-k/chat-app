import { Modal, Input, Button, Form, Space, Image, Avatar, Typography, Descriptions } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import './AddFriendModal.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FindFriend , selectFriend} from './AddFriendSlice';
const { Title, Text } = Typography;

interface ModalProps {
  isModalVisible: boolean;
  handleOk: () => void | undefined;
  handleCancel: () => void | undefined;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddFriendModal: FC<ModalProps> = (props) => {
  const { isModalVisible, setIsModalVisible, handleOk, handleCancel } = props;
  const [showSearchResult, setShowSearchResult] = useState(false);

  const Friends = useAppSelector(selectFriend);
  console.log(Friends);
  // useEffect(() => {
  //   console.log();
    
  // },[Friends])
  const dispatch = useAppDispatch();
  // handle submit form
  const onFinish = (values: any) => {
    dispatch(FindFriend(values))
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const inputNumber = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === 'Enter' && e.shiftKey === false) {
      onFinish( target.value);
    }
  };

  useEffect(() => {
    if (!isModalVisible) setShowSearchResult(false);
    // console.log(Friends);
  }, [isModalVisible]);

  return (
    <>
      <Modal
        title="Add friend"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal-add-friend"
        width={400}
        footer={
          !showSearchResult
            ? [
                <Button
                  type="text"
                  onClick={() => {
                    setIsModalVisible(true);
                  }}
                  size="large"
                >
                  Cancle
                </Button>,
                <Button
                  size="large"
                  form="searchFriend"
                  key="submit"
                  htmlType="submit"
                  type="primary"
                  onClick={() => {
                    setShowSearchResult(true);
                  }}
                >
                  Search
                </Button>,
              ]
            : null
        }
      >
        {showSearchResult ? (
          <>
            <Image
              width={400}
              src="https://cover-talk.zadn.vn/6/7/9/0/5/b1c672818fc133d72cb8685a850c578c.jpg"
              className="modal-add-friend__cover-image"
            />
            <Space direction="vertical" className="modal-add-friend__info">
              <Avatar
                size={100}
                src={
                  <Image src="https://s120-ava-talk.zadn.vn/d/9/9/1/6/120/b1c672818fc133d72cb8685a850c578c.jpg" />
                }
                className="modal-add-friend__avatar"
              />
              <Title level={4}>Your friend name</Title>
              <Space>
                <Button type="ghost">Chat now</Button>
                <Button type="primary">Add friend</Button>
              </Space>
              <Space direction="vertical">
                <Text>Username: {Friends.username}</Text>
                <Text>Gender: Male</Text>
                <Text>Birthday: 12/06/2000</Text>
              </Space>
            </Space>
          </>
        ) : (
          <Form
            name="searchFriend"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ padding: '1rem' }}
          >
            <Form.Item
              name="phoneNumber"
              rules={[{ required: true, message: 'Please input friend username!' }]}
            >
              <Input
                placeholder="username, Ex: pumk1206"
                className="modal-add-friend__search"
                size="large"
                onKeyPress={(e: any) => {
                  inputNumber(e);
                }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default AddFriendModal;
