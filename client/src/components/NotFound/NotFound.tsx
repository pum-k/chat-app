import { Button, Result } from 'antd';

const NotFound = () => {
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={() => window.history.back()}>Go Back</Button>}
      />
    </>
  );
};

export default NotFound;
