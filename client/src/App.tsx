import NotFound from 'components/NotFound/NotFound';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import Chat from 'features/chat/Chat';
import Login from 'features/login/Login';
import Register from 'features/register/Register';
import { Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    // <Route path="/register" component={Register} exact />
    <Switch>
      {
      localStorage.getItem('access_token') ? (
        <PrivateRoute path="/">
          <Chat />
        </PrivateRoute>
      ) : (
        <>
          {' '}
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />{' '}
        </>
      )}

      <Route path="*" component={NotFound} />
    </Switch>
  );
}

export default App;
