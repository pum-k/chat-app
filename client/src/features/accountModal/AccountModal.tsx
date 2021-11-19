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
  Tooltip,
} from 'antd';
import { EditOutlined, CameraOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useState } from 'react';
import './AccountModal.scss';
import moment from 'moment';
import { fetchUserModal, selectUserModal, updateUserModal } from './accountModalSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { updateUserType } from 'constants/accountModalTypes';
import UploadAvatarModal from 'features/uploadAvatarModal/UploadAvatarModal';
import UploadCoverImageModal from 'features/uploadCoverImageModal/UploadCoverImageModal';

interface ModalProps {
  isModalVisible: boolean;
  handleOk: () => void | undefined;
  handleCancel: () => void | undefined;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Title } = Typography;

const AccountModal: FC<ModalProps> = (props) => {
  const { isModalVisible, handleOk, handleCancel, setIsModalVisible } = props;
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [isModalVisibleUploadAvatar, setIsModalVisibleUploadAvatar] = useState(false);
  const [isModalVisibleUploadCoverImage, setIsModalVisibleUploadCoverImage] = useState(false);

  // fetch user
  useEffect(() => {
    dispatch(fetchUserModal());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get user from state
  const user = useAppSelector(selectUserModal);

  // handle form
  const onFinish = (values: any) => {
    setIsEditDisplayName(false);
    setIsModalVisible(false);
    let dataUpdate: updateUserType = {
      dateOfBirth: values.dateOfBirth || null,
      displayName: values.displayName || null,
      gender: values.gender,
    };
    dispatch(updateUserModal(dataUpdate));
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
  useEffect(() => {
    setIsEditDisplayName(false);
  }, [isModalVisible]);

  return (
    <>
      <UploadAvatarModal
        isModalVisible={isModalVisibleUploadAvatar}
        setIsModalVisibleClose={() => setIsModalVisibleUploadAvatar(false)}
      />
      <UploadCoverImageModal
        isModalVisible={isModalVisibleUploadCoverImage}
        setIsModalVisibleClose={() => setIsModalVisibleUploadCoverImage(false)}
      />
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
          <div style={{ width: 'auto', height: 'auto', position: 'relative' }}>
            <Tooltip title="Update cover image">
              <Button
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  zIndex: 10,
                }}
                icon={<CameraOutlined />}
                shape="circle"
                onClick={() => setIsModalVisibleUploadCoverImage(true)}
              />
            </Tooltip>

            <Image
              width={520}
              src={user.user_cover_image ? user.user_cover_image : 'error'}
              fallback="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
              className="modal-account__cover-image"
            />
          </div>

          <Space direction="vertical" className="modal-account__info" size="small">
            <div style={{ width: 'auto', height: 'auto', position: 'relative' }}>
              <Tooltip title="Update avatar">
                <Button
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '185px',
                    zIndex: 10,
                  }}
                  icon={<CameraOutlined />}
                  shape="circle"
                  onClick={() => setIsModalVisibleUploadAvatar(true)}
                />
              </Tooltip>

              <Avatar
                size={100}
                src={
                  <Image
                    src={user.user_avatar ? user.user_avatar : 'error'}
                    fallback="https://app.sabangcollege.ac.in/faculty_image/default.jpg"
                  />
                }
                className="modal-account__avatar"
              />
            </div>

            <Form.Item name="displayName">
              {isEditDisplayName ? (
                <Input
                  defaultValue={user.user_display_name || 'No available'}
                  size="large"
                  style={{ width: '100%' }}
                  onChange={() => setIsAllowSubmit(true)}
                />
              ) : (
                <>
                  <Title level={4}>{user.user_display_name || 'No available'}</Title>
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
            <Form.Item label="Username">
              <Input
                defaultValue={user.user_name || 'No available'}
                disabled
                size="large"
                onChange={() => setIsAllowSubmit(true)}
              />
            </Form.Item>
            <Form.Item label="Phone number">
              <Input
                defaultValue={user.user_phone_number || 'No available'}
                disabled
                size="large"
                onChange={() => setIsAllowSubmit(true)}
              />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Birthday">
              <DatePicker
                placeholder="2000-12-24"
                size="large"
                defaultValue={moment(moment(user.user_birthday).format('YYYY-MM-DD'), 'YYYY-MM-DD')}
                style={{ width: '100%' }}
                onChange={() => setIsAllowSubmit(true)}
              />
            </Form.Item>
            <Form.Item name="gender" label="Gender">
              <Radio.Group defaultValue={user.user_gender} onChange={() => setIsAllowSubmit(true)}>
                <Radio value={'male'}>Male</Radio>
                <Radio value={'female'}>Female</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default AccountModal;
