/* eslint-disable no-undef */
import React from 'react';
import { get } from 'lodash';
import ApiUtils, { MSApi } from '../utils/apiUtils';
import { LoginMain, ErrorMsg } from '../views/LoginLayout/styled';

import Loading from '../components/Loading';

export default function withAuth(
  WrappedComponent
){
  return class Auth extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        errorMsg: null,
        renewIframe: false,
        isLoading: true,
      };

      MSApi.handleRedirectCallback(ApiUtils.redirectCallback);
    }

    componentDidMount() {
      if (MSApi.isCallback(window.location.hash)) {
        this.setState({
          renewIframe: true,
        });
        return;
      }

      if (!MSApi.getAccount()) {
        MSApi.loginRedirect({});
      } else {
        MSApi.getAccessToken();
      }
    }

    getAccessTokenFromResponse(response) {
      const { loginSuccess } = this.props;
      const token = get(response, 'idToken.rawIdToken', '');
      const fullName = get(response, 'account.name', '');
      const userId = get(response, 'account.accountIdentifier', '');
      const expired = get(response, 'idToken.expiration', '');

      // show intercom widget
      window.Intercom("boot", {
        app_id: "gr2nqxk0",
        name: fullName, // Full name
        user_id: userId
      });

      loginSuccess({
        token,
        fullName,
        userId,
        expired,
      });
    }

    async getAccessToken() {
      const tokenRequest = {
        scopes: [process.env.REACT_APP_MSAL_CLIENT_ID],
      };

      try {
		console.log("MSAL: (index.js) calling 'acquireTokenSilent'");
        const response = await MSApi.acquireTokenSilent(tokenRequest);
        this.getAccessTokenFromResponse(response);
      } catch (error) {
		console.log("MSAL: (index.js) Error calling 'acquireTokenSilent'");
		console.log(error);
		console.log("MSAL: (index.js) calling 'acquireTokenRedirect'");
        MSApi.acquireTokenRedirect(tokenRequest);
      }
    }

    handleRedirectCallback = (error) => {
      if (error) {
        this.setState({
          errorMsg: error.errorMessage,
        });
      } else {
        this.getAccessToken();
      }
    };

    isAuthenticate() {
      return !!MSApi.getAccount();
    }

    render() {
      const { accessToken } = this.props;
      const { errorMsg, renewIframe } = this.state;
      const isAuthenticate = this.isAuthenticate();

      if (renewIframe || !isAuthenticate || !accessToken) {
        return (
          <LoginMain>
            <Loading subtext="Trying to log you in..." />
          </LoginMain>
        );
      }

      if (errorMsg) {
        return (
          <LoginMain>
            <ErrorMsg>{errorMsg}</ErrorMsg>
          </LoginMain>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}