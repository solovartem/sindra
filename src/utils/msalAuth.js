
import * as Msal from 'msal';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MSAL_CLIENT_ID || '8d6aef0b-4fe4-4b22-832e-4d96fdfb158b',
    authority: process.env.REACT_APP_AUTHORITY_LINK || 'https://planpod.b2clogin.com/tfp/planpod.onmicrosoft.com/B2C_1_login_flow',
    redirectUri: process.env.REACT_APP_REDIRECT_URL || 'https://localhost:3000/redirect',
    validateAuthority: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

const msalInstance = new Msal.UserAgentApplication(msalConfig);

msalInstance.handleRedirectCallback((error, result) => {
  // msal requires a redirect callback, even though can't use it to
  // get the result as it will redirect again after it has the result
  // and not provide the result of the call back on the second
  // redirect.
});

export default msalInstance;