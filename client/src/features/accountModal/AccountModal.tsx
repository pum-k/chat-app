import {
  Avatar,
  Image,
  Input,
  Modal,
  Space,
  Typography,
  Form,
  Button,
  DatePicker,
  Radio,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useState } from 'react';
import './AccountModal.scss';
import moment from 'moment';

interface ModalProps {
  isModalVisible: boolean;
  handleOk: () => void | undefined;
  handleCancel: () => void | undefined;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Title } = Typography;

const AccountModal: FC<ModalProps> = (props) => {
  const { isModalVisible, handleOk, handleCancel, setIsModalVisible } = props;

  const [form] = Form.useForm();

  // default account
  const user = {
    display: 'Duong Dang Khoa',
    username: 'ddkhoa1206',
    birthday: new Date('12/06/2000'),
    isMale: true,
  };

  // handle form
  const onFinish = (values: any) => {
    setIsEditDisplayName(false);
    setIsModalVisible(false);
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // reset info when close modal
  useEffect(() => {
    form.resetFields();
  }, [form, isModalVisible]);

  const [isAllowSubmit, setIsAllowSubmit] = useState(false);

  //handle edit display
  const [isEditDisplayName, setIsEditDisplayName] = useState(false);

  return (
    <>
      <Modal
        title="Account settings"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal-account"
        footer={[
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
            form="account"
            key="submit"
            htmlType="submit"
            type="primary"
            disabled={isAllowSubmit ? false : true}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="account"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Image
            width={520}
            src="https://cover-talk.zadn.vn/6/7/9/0/5/b1c672818fc133d72cb8685a850c578c.jpg"
            className="modal-account__cover-image"
          />
          <Space direction="vertical" className="modal-account__info">
            <Avatar
              size={100}
              src={
                <Image src="https://s120-ava-talk.zadn.vn/d/9/9/1/6/120/b1c672818fc133d72cb8685a850c578c.jpg" />
              }
              className="modal-account__avatar"
            />
            <Form.Item name="display">
              {isEditDisplayName ? (
                <Input
                  defaultValue={user.display}
                  size="large"
                  style={{ width: '100%' }}
                  onChange={() => setIsAllowSubmit(true)}
                />
              ) : (
                <>
                  <Title level={4}>{user.display}</Title>
                  <EditOutlined
                    style={{
                      marginBottom: '10px',
                      fontSize: 'large',
                      cursor: 'pointer',
                    }}
                    onClick={() => setIsEditDisplayName(true)}
                  />
                </>
              )}
            </Form.Item>
            <Form.Item name="username" label="Username">
              <Input
                defaultValue={user.username}
                disabled
                size="large"
                onChange={() => setIsAllowSubmit(true)}
              />
            </Form.Item>
            <Form.Item name="birthday" label="Birthday">
              <DatePicker
                placeholder="2000-12-24"
                size="large"
                defaultValue={moment(user.birthday, 'YYYY-MM-DD')}
                style={{ width: '100%' }}
                onChange={() => setIsAllowSubmit(true)}
              />
            </Form.Item>
            <Form.Item name="gender" label="Gender">
              <Radio.Group defaultValue={user.isMale} onChange={() => setIsAllowSubmit(true)}>
                <Radio value={true}>Male</Radio>
                <Radio value={false}>Female</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default AccountModal;
