import NotFound from 'components/NotFound/NotFound';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import ContentChat from 'features/contentChat/ContentChat';
import HeaderChat from 'features/headerChat/HeaderChat';
import Login from 'features/auth/login/Login';
import Register from 'features/auth/register/Register';
import SiderChat from 'features/siderChat/SiderChat';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  
  return (
    <div className="App">
      <Redirect to='/t' />
      <Switch>
        <PrivateRoute isAuthenticated={isAuthenticated} authenticationPath="/login" path="/t">
          <HeaderChat />
          <div
          style={{display: 'flex', width: '100%'}}
          >
            <SiderChat />
            <Switch>
              <Route exact path="/t/:id_room">
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
    </div>
  );
}

export default App;
