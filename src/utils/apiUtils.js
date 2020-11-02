

import axios from 'axios';
import https from 'https';
import { get } from 'lodash';
import store from '../redux/store';
import MsalInstance from './msalAuth';

export const MSApi = MsalInstance;
export function getAPIErrorMessage(error, defaultMessage = 'Internal server error') {
  return get(error, 'dataSource.error', defaultMessage);
}

class ApiUtils {
  static BASE_URL = process.env.REACT_APP_BASE_URL || "https://planpod.azure-api.net/api/dsrf/";
  static API_VERSION_NONE = "";
  static API_VERSION_1 = "v1";
  static API_VERSION_2 = "v2";
  static HTTP = axios.create({
    baseURL: ApiUtils.BASE_URL,
  });
  static HTTPS = axios.create({
    withCredentials: true,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    baseURL: ApiUtils.BASE_URL,
  });

  constructor() {
    MsalInstance.handleRedirectCallback(ApiUtils.redirectCallback);
  }

  static redirectCallback() {
    ApiUtils.getAccessToken();
  }

  static async getAccessToken() {
    const tokenRequest = {
      scopes: [process.env.REACT_APP_MSAL_CLIENT_ID],
    };
    try {
      const response = await MsalInstance.acquireTokenSilent(tokenRequest);
      const accessToken = get(response, "idToken.rawIdToken", "");
      return accessToken;
    }
    catch (error) {
      console.log("MSAL: (apiUtils.js) Error calling 'acquireTokenSilent'");
      console.log(error);
      console.log("MSAL: (apiUtils.js) calling 'acquireTokenRedirect'");
      MsalInstance.acquireTokenRedirect(tokenRequest);
    }
  }

  static getExpiredAt() {
    const rootState = store.getState();
    return rootState["AUTH"] && rootState["AUTH"].get("expired");
  }

  static shouldRefreshToken() {
    // bypass for now
    return false;
    // const token = ApiUtils.getAccessToken();
    // const expiredAt = ApiUtils.getExpiredAt();
    //
    // if (token && expiredAt) {
    //   return moment().unix() > expiredAt;
    // }
    //
    // return false;
  }

  static handleLogout() {
    return MsalInstance.logout();
  }
}

ApiUtils.HTTP.interceptors.request.use(async (extendedConfig) => {
  const config = Object.assign({}, extendedConfig);
  const accessToken = (await ApiUtils.getAccessToken()) || null;

  if (!config.headers.Authorization) {
    config.headers.Authorization = accessToken && `Bearer ${accessToken}`;
  }

  let endPoint;
  switch (config.apiVersion) {
    case ApiUtils.API_VERSION_2:
      endPoint = ApiUtils.BASE_URL + ApiUtils.API_VERSION_2;
      break;
    case ApiUtils.API_VERSION_NONE:
      endPoint = ApiUtils.BASE_URL ? ApiUtils.BASE_URL.slice(0, ApiUtils.BASE_URL.lastIndexOf('/')) : ApiUtils.BASE_URL;
      break;
    case ApiUtils.API_VERSION_1:
      endPoint = ApiUtils.BASE_URL + ApiUtils.API_VERSION_1;
      break;
    default:
      endPoint = ApiUtils.BASE_URL ? ApiUtils.BASE_URL.slice(0, ApiUtils.BASE_URL.lastIndexOf('/')) : ApiUtils.BASE_URL;
      break;
  }

  if (!config.absoluteUrl) {
    config.url = endPoint ? endPoint + config.url : endPoint;
  } else {
    config.url = endPoint;
  }

  return config;
});

ApiUtils.HTTP.interceptors.response.use(
  (response) => response,
  error => {
    if (error && error.response && error.response.status === 401) {
      ApiUtils.handleLogout();
    }
    return Promise.reject(error);
  },
);

ApiUtils.HTTPS.interceptors.request.use(async (extendedConfig) => {
  const config = Object.assign({}, extendedConfig);

  const accessToken = (await ApiUtils.getAccessToken()) || null;

  if (!config.headers.Authorization) {
    config.headers.Authorization = accessToken && `Bearer ${accessToken}`;
  }

  let endPoint;
  switch (config.apiVersion) {
    case ApiUtils.API_VERSION_2:
      endPoint = ApiUtils.BASE_URL + ApiUtils.API_VERSION_2;
      break;
    case ApiUtils.API_VERSION_NONE:
      endPoint = ApiUtils.BASE_URL ? ApiUtils.BASE_URL.slice(0, ApiUtils.BASE_URL.lastIndexOf('/')) : ApiUtils.BASE_URL;
      break;
    case ApiUtils.API_VERSION_1:
      endPoint = ApiUtils.BASE_URL + ApiUtils.API_VERSION_1;
      break;
    default:
      endPoint = ApiUtils.BASE_URL ? ApiUtils.BASE_URL.slice(0, ApiUtils.BASE_URL.lastIndexOf('/')) : ApiUtils.BASE_URL;
      break;
  }

  if (!config.absoluteUrl) {
    config.url = endPoint ? endPoint + config.url : endPoint;
  } else {
    config.url = endPoint;
  }

  return config;
});

ApiUtils.HTTPS.interceptors.response.use(
  (response) => response,
  error => {
    if (error && error.response && error.response.status === 401) {
      ApiUtils.handleLogout();
    }
    return Promise.reject(error);
  },
);

export default ApiUtils;