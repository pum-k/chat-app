import React from 'react';
import { Redirect, useHistory, Route, RouteProps, Switch } from 'react-router-dom';
import Login from 'features/login/Login';
import Register from 'features/register/Register';

const PrivateRoute = (props: RouteProps) => {
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));

  if (!isLoggedIn)
    return (
      <Switch>
        <Redirect to="/login" />
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    );
  else return <Route {...props} />;
};

export default PrivateRoute;
