// ProtectedRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  loggedin?: boolean;
  pro?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  loggedin = false,
  pro = false,
  ...rest
}) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser !== null,
  );
  const proStatus = useSelector(
    (state: RootState) => state.authStatus.proStatus,
  );

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedin && !isLoggedIn) {
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          );
        }

        if (pro && !proStatus) {
          return (
            <Redirect
              to={{ pathname: '/App/Account', state: { from: props.location } }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
