import NotFound from 'components/NotFound/NotFound';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import ContentChat from 'features/contentChat/ContentChat';
import HeaderChat from 'features/headerChat/HeaderChat';
import Login from 'features/auth/login/Login';
import Register from 'features/auth/register/Register';
import SiderChat from 'features/siderChat/SiderChat';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { Spin } from 'antd';
import { useState } from 'react';

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(false);
  

  return (
    <div className="App">
      <Spin spinning={loading} tip="Loading..." size="large">
        <Redirect to="/t" />
        <Switch>
          <PrivateRoute isAuthenticated={isAuthenticated} authenticationPath="/login" path="/t">
            <HeaderChat />
            <div style={{ display: 'flex', width: '100%' }}>
              <SiderChat onLoading={() => setLoading(true)} offLoading={() => setLoading(false)}/>
              <Switch>
                <Route path="/t/:room">
                  <ContentChat />
                </Route>
              </Switch>
            </div>
          </PrivateRoute>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Spin>
    </div>
  );
}

export default App;
