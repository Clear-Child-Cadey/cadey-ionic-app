import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps extends RouteProps {
  component?: React.ComponentType<any>;
  enforceLoggedIn?: boolean;
  enforcePro?: boolean;
  render?: (props: any) => React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  enforceLoggedIn = false,
  enforcePro = false,
  render,
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

        if (Component) {
          return <Component {...props} />;
        }

        if (render) {
          return render(props);
        }

        return null;
      }}
    />
  );
};

export default ProtectedRoute;
