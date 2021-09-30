import { Modal, Input, Button, Form, Space, Image, Avatar, Typography, Descriptions } from 'antd';
import React, { FC } from 'react';
import { FieldValues, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import './AddFriendModal.scss';

const { Title, Text } = Typography;

interface ModalProps {
  isModalVisible: boolean;
  handleOk: () => void | undefined;
  handleCancel: () => void | undefined;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddFriendModal: FC<ModalProps> = (props) => {
  const { isModalVisible, setIsModalVisible, handleOk, handleCancel } = props;

  // handle submit form
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

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
          false
            ? [
                <Button
                  type="text"
                  onClick={() => {
                    setIsModalVisible(false);
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
                >
                  Search
                </Button>,
              ]
            : null
        }
      >
        {/* <Form
          name="searchFriend"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input friend username!' }]}
          >
            <Input placeholder="username, Ex: pumk1206" className="modal-add-friend__search" />
          </Form.Item>
        </Form> */}
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
            <Text>Username: Duong Dang Khoa</Text>
            <Text>Gender: Male</Text>
            <Text>Birthday: 12/06/2000</Text>
          </Space>
        </Space>
      </Modal>
    </>
  );
};

export default AddFriendModal;
