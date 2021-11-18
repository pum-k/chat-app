import { message, Modal, Upload } from 'antd';
import { FC, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './UploadCoverImageModal.scss';

interface Props {
  isModalVisible: boolean;
  setIsModalVisibleClose: () => void;
}

const UploadCoverImageModal: FC<Props> = (prop) => {
  const { isModalVisible, setIsModalVisibleClose } = prop;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleOk = () => {
    setIsModalVisibleClose();
    console.log(imageUrl)
  };

  const handleCancel = () => {
    setIsModalVisibleClose();
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Select file image .png/.jpeg </div>
    </div>
  );

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

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);

      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };

  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  return (
    <Modal
      title="Update cover image"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal-upload-img"
      width={850}
    >
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        customRequest={dummyRequest}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img height="400" width="800" src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    </Modal>
  );
};

export default UploadCoverImageModal;
