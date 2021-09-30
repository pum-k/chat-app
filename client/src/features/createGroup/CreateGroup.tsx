import { Button, Input, Modal, Space, Form, List, Typography, Avatar, Checkbox } from 'antd';
import React, { FC } from 'react';
import './CreateGroup.scss';
import { CameraOutlined, SearchOutlined } from '@ant-design/icons';

interface ModalProps {
  isModalVisible: boolean;
  handleOk: () => void | undefined;
  handleCancel: () => void | undefined;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateGroup: FC<ModalProps> = (props) => {
  const { isModalVisible, setIsModalVisible, handleOk, handleCancel } = props;
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  //list friend
  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 5',
    },
    {
      title: 'Ant Design Title 5',
    },
    {
      title: 'Ant Design Title 6',
    },
    {
      title: 'Ant Design Title 7',
    },
  ];
  return (
    <>
      <Modal
        title="Create Group"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal-create-group"
        width={520}
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
          <Button size="large" form="createGroup" key="submit" htmlType="submit" type="primary">
            Submit
          </Button>,
        ]}
      >
        <Form
          name="createGroup"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Space direction="vertical">
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input name's group!" }]}
            >
              <Space>
                <Button type="default" icon={<CameraOutlined />}></Button>
                <Input
                  className="modal-create-group__name-group"
                  placeholder="name of the group"
                  style={{ width: '420px' }}
                />
              </Space>
            </Form.Item>

            <Form.Item label="Add member to group:">
              <Input
                placeholder="enter username"
                allowClear
                suffix={<SearchOutlined style={{ fontSize: '18px' }} />}
                bordered={false}
                className="modal-create-group__search-member"
                size="large"
              />
            </Form.Item>
            <Form.Item
              style={{ height: '300px', overflow: 'auto', borderTop: '1px solid #eee' }}
              name="members"
            >
              <Checkbox.Group>
                <List
                  dataSource={data}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Checkbox value={index} style={{ width: '455px' }}>
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        {item.title}
                      </Checkbox>
                    </List.Item>
                  )}
                />
              </Checkbox.Group>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default CreateGroup;
