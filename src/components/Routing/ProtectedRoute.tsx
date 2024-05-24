// ProtectedRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  enforceLoggedIn?: boolean;
  enforcePro?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  enforceLoggedIn = false,
  enforcePro = false,
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
        if (enforceLoggedIn && !isLoggedIn) {
          return (
            <Redirect
              to={{
                pathname: '/App/Authentication/Login',
                state: { from: props.location },
              }}
            />
          );
        }

        if (enforcePro && !proStatus) {
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
