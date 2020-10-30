import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import withAuth from './Auth';
import MsalInstance from './utils/msalAuth';
import { withTracker } from './utils/withTracker';
import { AuthActions } from './redux/reducers/auth';

import './App.css';
import 'antd/dist/antd.css';
import { Home } from './views/Home';
import Layout from './views/DefaultLayout';
import LoginLayout from './views/LoginLayout';

const PublicRoute = props => {
  const { component: Component, ...rest } = props;

  if (MsalInstance.getAccount()) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <LoginLayout>
          <Component {...matchProps} />
        </LoginLayout>
      )}
    />
  );
};

const PrivateRoute = props => {
  const { component: Component, ...rest } = props;

  if (!MsalInstance.getAccount()) {
    return null;
  }

  return (
    <Layout>
      <Route {...rest} component={withTracker(Component)} />
    </Layout>
  );
};

const NotFound = () => {
  return <Redirect to="/" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PublicRoute component={NotFound} />
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => {
    console.log('---mapStateToProps---', state);
    return ({
    accessToken: state['AUTH'].token,
  })
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loginSuccess: AuthActions.loginSuccess,
    },
    dispatch,
  );

const WithAuthAppRouter = withAuth(AppRouter);

const AppRouterConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithAuthAppRouter);

const App = () => {
  return (
    <AppRouterConnect />
  );
};
export default App;
