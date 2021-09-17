import { Spin } from 'antd';
import React from 'react';
import './Loading.scss';

const Loading = () => {
  return (
    <div className="loading">
      <Spin tip="Loading..." size="large"></Spin>
    </div>
  );
};

export default Loading;
