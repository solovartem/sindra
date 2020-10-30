import { get } from 'lodash';

const hostname = get(window, 'location.hostname', '');
const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
const defaultEnv = isLocalHost ? 'local' : 'development';

export default {
  BASE_URI: process.env.REACT_APP_BASE_URL+'dsrf',
  ENV: process.env.REACT_APP_ENV || defaultEnv,
  TABLE_API: process.env.REACT_APP_JSON_DROPDOWN_API || 'https://cors-anywhere.herokuapp.com/https://dsrf-api.azurewebsites.net/api/v1',
  REACT_APP_VERSION: process.env.REACT_APP_VERSION || 'N/A',
};
