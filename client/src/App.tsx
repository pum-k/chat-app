import NotFound from 'components/NotFound/NotFound';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import HeaderChat from 'features/headerChat/HeaderChat';
import Login from 'features/auth/login/Login';
import Register from 'features/auth/register/Register';
import SiderChat from 'features/siderChat/SiderChat';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import ContentChat from 'features/contentChat/ContentChat';

const socket = io('http://localhost:4000');

const HomeChat = () => {
  useEffect(() => {
    socket.emit('user_connection', {
      id: localStorage.getItem('access_token'),
      username: localStorage.getItem('username'),
    });
  }, []);

  return (
    <>
      <HeaderChat socket={socket} />
      <div style={{ display: 'flex', width: '100%' }}>
        <SiderChat socket={socket} />
        <Switch>
          <Route exact path="/t/:room">
            <ContentChat />
          </Route>
        </Switch>
      </div>
    </>
  );
};

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));

  return (
    <div className="App">
        <Redirect to="/t" />
        <Switch>
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            authenticationPath="/login"
            path="/t"
          >
            <HomeChat />
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
    </div>
  );
}

export default App;
