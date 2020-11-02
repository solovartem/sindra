import React from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { bindActionCreators } from "redux";

import withAuth from "./Auth";
import MsalInstance from "./utils/msalAuth";
import { withTracker } from "./utils/withTracker";
import { AuthActions } from "./redux/reducers/auth";

import "./App.css";
import "antd/dist/antd.css";
import Layout from "./views/DefaultLayout";
import LoginLayout from "./views/LoginLayout";
import Loading from "./components/Loading";

const NewRequest = React.lazy(() => import("./views/NewRequest"));
const Landing = React.lazy(() => import("./views/Landing"));

const PublicRoute = props => {
  const { component: Component, ...rest } = props;

  if (MsalInstance.getAccount()) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={matchProps => (
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
      <React.Suspense
        fallback={<Loading subtext="Loading ..." color="black" />}
      >
        <Switch>
          <PrivateRoute exact path="/" component={Landing} />
          <PrivateRoute exact path="/soa/new-request" component={NewRequest} />
          <PrivateRoute exact path="/soa/:soaId" component={NewRequest} />
          <PublicRoute component={NotFound} />
        </Switch>
      </React.Suspense>
    </Router>
  );
};

const mapStateToProps = state => {
  console.log("---mapStateToProps---", state);
  return {
    accessToken: state["AUTH"].token,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loginSuccess: AuthActions.loginSuccess,
    },
    dispatch
  );

const WithAuthAppRouter = withAuth(AppRouter);

const AppRouterConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuthAppRouter);

const App = () => {
  return <AppRouterConnect />;
};
export default App;
