export const AuthState = {
  page: undefined,
  loading: undefined,
  error: undefined,
  message: undefined,
  userId: undefined,
  token: undefined,
  expired: undefined,
  refreshToken: undefined,
  fullName: undefined,
  avatarUrl: undefined,
}

export const defaultAuthState = {
  page: 1,
  loading: false,
  error: '',
  message: '',
  userId: '',
  token: '',
  expired: 0,
  refreshToken: '',
  fullName: '',
  avatarUrl: '',
};

export const AuthStateRecord = {
  page: 1,
  loading: false,
  error: '',
  message: '',
  userId: '',
  token: '',
  expired: 0,
  refreshToken: '',
  fullName: '',
  avatarUrl: '',
}

// Define action types
export const AuthActionTypes = {
  VERIFY_EMAIL_REQUEST: 'auth/VERIFY_EMAIL_REQUEST',
  VERIFY_EMAIL_SUCCESS: 'auth/VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_FAILURE: 'auth/VERIFY_EMAIL_FAILURE',
  VERIFY_PASSWORD_REQUEST: 'auth/VERIFY_PASSWORD_REQUEST',
  VERIFY_PASSWORD_SUCCESS: 'auth/VERIFY_PASSWORD_SUCCESS',
  VERIFY_PASSWORD_FAILURE: 'auth/VERIFY_PASSWORD_FAILURE',
  VERIFY_OTP_REQUEST: 'auth/VERIFY_OTP_REQUEST',
  VERIFY_OTP_SUCCESS: 'auth/VERIFY_OTP_SUCCESS',
  VERIFY_OTP_FAILURE: 'auth/VERIFY_OTP_FAILURE',
  REFRESH_TOKEN_REQUEST: 'auth/REFRESH_TOKEN_REQUEST',
  REFRESH_TOKEN_SUCCESS: 'auth/REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILURE: 'auth/REFRESH_TOKEN_FAILURE',
  LOGIN_SUCCESS: 'auth/LOGIN_SUCCESS',
}