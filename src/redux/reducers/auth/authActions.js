import {
  AuthActionTypes,
} from './authTypes';
import { createPayloadAction } from './reducerHelper';

export default class AuthActions {
  static verifyEmail = (payload) =>
    createPayloadAction(AuthActionTypes.VERIFY_EMAIL_REQUEST, payload);

  static verifyPassword = (payload) =>
    createPayloadAction(AuthActionTypes.VERIFY_PASSWORD_REQUEST, payload);

  static verifyOTP = (payload) =>
    createPayloadAction(AuthActionTypes.VERIFY_OTP_REQUEST, payload);

  static verifyOTPCompleted = (payload) =>
    createPayloadAction(AuthActionTypes.VERIFY_OTP_SUCCESS, payload);

  static refreshToken = () => createPayloadAction(AuthActionTypes.REFRESH_TOKEN_REQUEST, {});

  static refreshTokenCompleted = (payload) =>
    createPayloadAction(AuthActionTypes.REFRESH_TOKEN_SUCCESS, payload);

  static loginSuccess = (payload) =>
    createPayloadAction(AuthActionTypes.LOGIN_SUCCESS, payload);
}