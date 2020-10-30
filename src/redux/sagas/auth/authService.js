import ApiUtils from '../../../utils/apiUtils';

export default class AuthService {
  static async verifyEmail(email){
    const url = '/auth/email';
    const data = { email };
    const config = {
      apiVersion: ApiUtils.API_VERSION_1, // default v1
    };
    return ApiUtils.HTTPS.post(url, data, config);
  }
  static async verifyPassword(password) {
    const url = '/auth/password';
    const data = { password };
    const config = {
      apiVersion: ApiUtils.API_VERSION_1, // default v1
    };
    return ApiUtils.HTTPS.post(url, data, config);
  }
  static async verifyOTP(otp) {
    const url = '/auth/token';
    const data = { otp };
    const config = {
      apiVersion: ApiUtils.API_VERSION_1, // default v1
    };
    return ApiUtils.HTTPS.post(url, data, config);
  }
  static async refreshToken(refreshToken) {
    const url = '/auth/refresh';
    const config = {
      apiVersion: ApiUtils.API_VERSION_1,
    };
    config.headers.Authorization = `Bearer ${refreshToken}`;

    return ApiUtils.HTTPS.get(url, config);
  }
}