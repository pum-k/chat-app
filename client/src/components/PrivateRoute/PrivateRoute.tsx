import { Redirect, Route, RouteProps } from 'react-router';

export type PrivateRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
} & RouteProps;

export default function PrivateRoute({isAuthenticated, authenticationPath, ...routeProps}: PrivateRouteProps) {
  if(isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: authenticationPath }} />;
  }
};