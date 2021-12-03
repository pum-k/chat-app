import { LoginInput } from 'constants/AccountTypes';
import { useForm, SubmitHandler } from 'react-hook-form';
import { message, Typography } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import './Login.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { authLogin, removeError, removeIsSuccess } from 'features/auth/authSlice';
import { useEffect } from 'react';
import { selectLoadingAuth, selectErrorAuth } from 'features/auth/authSlice';

const { Text } = Typography;

const Login = () => {
  let history = useHistory();
  const loading = useAppSelector(selectLoadingAuth);
  const error = useAppSelector(selectErrorAuth);
  const isSuccess = useAppSelector((state) => state.auth.isSuccess);
  useEffect(() => {
    dispatch(removeIsSuccess());
    let isAuthenticated = Boolean(localStorage.getItem('access_token'));
    if (isAuthenticated) {
      setTimeout(() => {
        history.push('/t');
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();
  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    dispatch(authLogin(data));
  };

  let key = 'login';
  useEffect(() => {
    if (error) {
      message.error({ content: `${error}`, key, duration: 2 });
      dispatch(removeError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  useEffect(() => {
    if (loading) {
      message.loading({ content: 'Loading...', key });
    }
    if (isSuccess && !loading) {
      message.success({ content: 'Login successfully!', key });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
