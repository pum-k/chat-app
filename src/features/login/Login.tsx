import { LoginInput } from 'constants/AccountTypes';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import './Login.scss';

const { Text } = Typography;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();
  const onSubmit: SubmitHandler<LoginInput> = (data) => console.log(data);

  return (
    <div className="login-layout">
      <div className="login">
        <section className="login__header">
          <h1>Welcome back!</h1>
          <p>We're so excited to see you again!</p>
        </section>
        <section className="login__content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <section>
              <h5>
                {errors.username ? (
                  errors.username.type !== 'minLength' ? (
                    <Text type="danger">USERNAME - This field is required</Text>
                  ) : (
                    <Text type="danger">USERNAME - Username must be at least 6 characters</Text>
                  )
                ) : (
                  <Text>USERNAME</Text>
                )}
              </h5>

              <input
                type="text"
                {...register('username', { required: true, minLength: 6 })}
                className="login__content__input"
                autoComplete="off"
              />
            </section>

            <section>
              <h5>
                {errors.password ? (
                  <Text type="danger">PASSWORD - This field is required</Text>
                ) : (
                  <Text>PASSWORD</Text>
                )}
              </h5>
              <input
                type="password"
                {...register('password', { required: true })}
                className="login__content__input"
                autoComplete="off"
              />
              <Space>
                <Link to="/forgot-password">Forgot your password?</Link>
              </Space>
            </section>

            <input type="submit" value="Login" className="login__content__btn" />
          </form>
        </section>
        <section className="login__footer">
          <p>
            Need an account? <Link to="/register">Register</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
