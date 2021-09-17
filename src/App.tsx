import NotFound from 'components/NotFound/NotFound';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import Chat from 'features/chat/Chat';
import Login from 'features/login/Login';
import Register from 'features/register/Register';
import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} exact />
      <Route path="/register" component={Register} exact />
      <PrivateRoute path="/">
        <Chat />
      </PrivateRoute>

      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
