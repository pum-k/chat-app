import { message, Modal, Upload } from 'antd';
import { FC, useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './UploadCoverImageModal.scss';
import { userApi } from 'api/userApi';
import { useAppDispatch } from 'app/hooks';
import { uploadCover } from 'features/headerChat/headerChatSlice';

interface Props {
  isModalVisible: boolean;
  setIsModalVisibleClose: () => void;
}

const UploadCoverImageModal: FC<Props> = (prop) => {
  const dispatch = useAppDispatch();
  const { isModalVisible, setIsModalVisibleClose } = prop;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleOk = () => {
    setIsModalVisibleClose();
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
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setImageUrl(imageUrl);
        message.success('Upload your avatar successfully!');
        dispatch(uploadCover(imageUrl));
        setIsModalVisibleClose();
      });
    }
  };

  const dummyRequest = ({ file, onSuccess }: any) => {
    let data = new FormData();
    data.append('file', file);
    data.append('owners', localStorage.getItem('access_token') || '');
    userApi.updateCover(data);

    setTimeout(() => {
      onSuccess('ok');
    }, 500);
  };

  useEffect(() => {
    setImageUrl(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible===false])

  return (
    <Modal
      title="Update cover image"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal-upload-cover-img"
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
