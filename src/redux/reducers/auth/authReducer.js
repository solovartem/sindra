import { fromJS } from 'immutable';
import { defaultAuthState, AuthActionTypes } from './authTypes';

export const loginHander = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      const userId = action.payload.userId;
      const token = action.payload.token;
      const fullName = action.payload.fullName;
      const expired = action.payload.expired;
      return Object.assign({}, state, {
        loading: false,
        message: '',
        userId,
        token,
        fullName,
        expired,
      })
      // return state['AUTH'].merge(
      //   fromJS({
      //     loading: false,
      //     message: '',
      //     userId,
      //     token,
      //     fullName,
      //     expired,
      //   }),
      // );
    }
    default:
      return state;
  }
}

export const verifyEmailHandler = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.VERIFY_EMAIL_REQUEST:
      return state.set('loading', true).set('error', '');

    case AuthActionTypes.VERIFY_EMAIL_SUCCESS:
      return state.merge(
        fromJS({
          loading: false,
          page: 2,
        }),
      );

    case AuthActionTypes.VERIFY_EMAIL_FAILURE:
      return state.set('loading', false).set('error', action.error);

    default:
      return state;
  }
}

export const verifyPasswordHandler = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.VERIFY_PASSWORD_REQUEST:
      return state
        .set('loading', true)
        .set('error', '')
        .set('message', '');

    case AuthActionTypes.VERIFY_PASSWORD_SUCCESS:
      return state.merge(
        fromJS({
          loading: false,
          message: action.payload.message,
          page: 3,
        }),
      );

    case AuthActionTypes.VERIFY_PASSWORD_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error)
        .set('message', '');

    default:
      return state;
  }
}

export const verifyOTPHandler = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.VERIFY_OTP_REQUEST:
      return state
        .set('loading', true)
        .set('error', '')
        .set('token', '')
        .set('refreshToken', '')
        .set('expired', '')
        .set('fullName', '')
        .set('avatarUrl', '');

    case AuthActionTypes.VERIFY_OTP_SUCCESS: {
      const userId = action.payload.userId;
      const token = action.payload.token;
      const expired = action.payload.expired;
      const refreshToken = action.payload.refreshToken;
      const fullName = action.payload.fullName;
      const avatarUrl = action.payload.avatarUrl;

      return state.merge(
        fromJS({
          loading: false,
          message: '',
          userId,
          token,
          expired,
          refreshToken,
          fullName,
          avatarUrl,
        }),
      );
    }

    case AuthActionTypes.VERIFY_OTP_FAILURE:
      return state.set('loading', false).set('error', action.error);

    default:
      return state;
  }
}

export const refreshTokenHandler = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.REFRESH_TOKEN_REQUEST:
      return state
        .set('loading', true)
        .set('error', '')
        .set('token', '')
        .set('expired', '');

    case AuthActionTypes.REFRESH_TOKEN_SUCCESS: {
      const token = action.payload.token;
      const expired = action.payload.expired;

      return state.merge(
        fromJS({
          loading: false,
          message: '',
          token,
          expired,
        }),
      );
    }

    case AuthActionTypes.REFRESH_TOKEN_FAILURE:
      return state.set('loading', false).set('error', action.error);

    default:
      return state;
  }
}
export default (
  state = defaultAuthState,
  action,
) => {
  switch (action.type) {
    case AuthActionTypes.VERIFY_EMAIL_REQUEST:
    case AuthActionTypes.VERIFY_EMAIL_SUCCESS:
    case AuthActionTypes.VERIFY_EMAIL_FAILURE:
      return verifyEmailHandler(state, action);
    case AuthActionTypes.VERIFY_PASSWORD_REQUEST:
    case AuthActionTypes.VERIFY_PASSWORD_SUCCESS:
    case AuthActionTypes.VERIFY_PASSWORD_FAILURE:
      return verifyPasswordHandler(state, action);
    case AuthActionTypes.VERIFY_OTP_REQUEST:
    case AuthActionTypes.VERIFY_OTP_SUCCESS:
    case AuthActionTypes.VERIFY_OTP_FAILURE:
      return verifyOTPHandler(state, action);
    case AuthActionTypes.REFRESH_TOKEN_REQUEST:
    case AuthActionTypes.REFRESH_TOKEN_SUCCESS:
    case AuthActionTypes.REFRESH_TOKEN_FAILURE:
      return refreshTokenHandler(state, action);
    case AuthActionTypes.LOGIN_SUCCESS:
      return loginHander(state, action);
    default:
      return state;
  }
};