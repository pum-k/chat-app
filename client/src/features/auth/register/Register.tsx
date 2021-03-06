import React, { useEffect } from 'react';
import './Register.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RegisterInput } from 'constants/AccountTypes';
import { message, Typography } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  authRegister,
  removeError,
  removeIsSuccess,
  selectErrorAuth,
  selectIsSuccess,
  selectLoadingAuth,
} from 'features/auth/authSlice';

const { Text } = Typography;

const Register = () => {
  let history = useHistory();
  useEffect(() => {
    let isAuthenticated = Boolean(localStorage.getItem('access_token'));
    if (isAuthenticated) {
      history.push('/login');
    } else {
      dispatch(removeIsSuccess());
    }
  });
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>();
  const onSubmit: SubmitHandler<RegisterInput> = (data) => {
    dispatch(authRegister(data));
  };

  const loading = useAppSelector(selectLoadingAuth);
  const error = useAppSelector(selectErrorAuth);
  const isSuccess = useAppSelector(selectIsSuccess);
  console.log(isSuccess);

  let key = 'register';
  useEffect(() => {
    if (error) {
      message.error({ content: `${error}`, key, duration: 2 });
      dispatch(removeError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  useEffect(() => {
    if (loading) {
      message.loading({ content: 'Loading...', key, duration: 2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  useEffect(() => {
    if (isSuccess) {
      message.success({ content: 'Register successfully', key, duration: 2 });
      history.push('/login');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className="register-layout">
      <div className="register">
        <section className="register__header" style={{ height: '10%' }}>
          <h1 style={{ textAlign: 'center' }}>Create an account</h1>
        </section>
        <section className="register__content" style={{ height: '80%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <section>
              <h5>
                {errors.username ? (
                  errors.username.type !== 'minLength' ? (
                    <Text type="danger">USERNAME - This field is required</Text>
                  ) : (
                    <Text type="danger">USERNAME - must be at least 6 characters</Text>
                  )
                ) : (
                  <Text>USERNAME</Text>
                )}
              </h5>
              <input
                type="text"
                className="register__content__input"
                {...register('username', { required: true, minLength: 6 })}
                autoComplete="off"
              />
            </section>
            <section>
              <h5>
                {errors.phoneNumber ? (
                  errors.phoneNumber.type !== 'minLength' ? (
                    <Text type="danger">PHONE NUMBER - This field is required</Text>
                  ) : (
                    <Text type="danger">PHONE NUMBER - Invalid phone number</Text>
                  )
                ) : (
                  <Text>PHONE NUMBER</Text>
                )}
              </h5>
              <input
                type="number"
                className="register__content__input"
                {...register('phoneNumber', { required: true, minLength: 10 })}
                autoComplete="off"
              />
            </section>
            <section>
              <h5>
                {errors.password ? (
                  errors.password.type !== 'minLength' ? (
                    <Text type="danger">PASSWORD - This field is required</Text>
                  ) : (
                    <Text type="danger">PASSWORD - must be at least 6 characters</Text>
                  )
                ) : (
                  <Text>PASSWORD</Text>
                )}
              </h5>

              <input
                type="password"
                className="register__content__input"
                {...register('password', { required: true, minLength: 6 })}
              />
            </section>
            <section>
              <h5>
                {errors.dateOfBirth ? (
                  <Text type="danger">DATE OF BIRTH - This field is required</Text>
                ) : (
                  <Text>DATE OF BIRTH</Text>
                )}
              </h5>
              <input
                type="date"
                className="register__content__input"
                {...register('dateOfBirth', { required: true })}
              />
            </section>
            <input type="submit" value="Continue" className="register__content__btn" />
          </form>
        </section>
        <section className="register__footer" style={{ height: '10%' }}>
          <Link to="/login">Already have an account?</Link>
        </section>
      </div>
    </div>
  );
};

export default Register;
