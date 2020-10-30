import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import { get, isFunction } from 'lodash';

import { AuthActionTypes, AuthActions } from '../../reducers/auth';
import AuthService from './authService';

function getAPIErrorMessage(error, defaultMessage = 'Internal server error') {
  return get(error, 'dataSource.error', defaultMessage);
}

// class AuthSaga {
//   static *verifyEmail({ payload }) {
//     try {
//       const { email } = payload;
//       const response = yield call(AuthService.verifyEmail, email);
//       if (response.status === 200 && response.data.success) {
//         yield put({
//           type: AuthActionTypes.VERIFY_EMAIL_SUCCESS,
//         });
//       }
//     } catch (error) {
//       yield put({
//         type: AuthActionTypes.VERIFY_EMAIL_FAILURE,
//         error: getAPIErrorMessage(error),
//       });
//     }
//   }

//   static *verifyPassword({ payload }) {
//     try {
//       const {  password } = payload;
//       const response = yield call(AuthService.verifyPassword, password);
//       if (response.status === 200 && response.data.success) {
//         yield put({
//           type: AuthActionTypes.VERIFY_PASSWORD_SUCCESS,
//           payload: {
//             message: response.data.message,
//           },
//         });
//       }
//     } catch (error) {
//       yield put({
//         type: AuthActionTypes.VERIFY_PASSWORD_FAILURE,
//         error: getAPIErrorMessage(error),
//       });
//     }
//   }

//   static *verifyOTP({ payload }) {
//     const { otp, callback } = payload;
//     try {
//       const response = yield call(AuthService.verifyOTP, otp);
//       if (response.status === 200 && response.data.success) {
//         const userId = response.data.data.user_id;
//         const token = response.data.data.access_token;
//         const expired = response.data.data.access_token_expires;
//         const refreshToken = response.data.data.refresh_token;
//         const fullName = response.data.data.full_name;
//         const avatarUrl = response.data.data.avatar_url;

//         yield put(
//           AuthActions.verifyOTPCompleted({
//             userId,
//             token,
//             expired,
//             refreshToken,
//             fullName,
//             avatarUrl,
//           }),
//         );
//       }
//       if (callback && isFunction(callback)) {
//         callback();
//       }
//     } catch (error) {
//       const errorMsg = getAPIErrorMessage(error);
//       yield put({
//         type: AuthActionTypes.VERIFY_OTP_FAILURE,
//         error: errorMsg,
//       });
//       if (callback && isFunction(callback)) {
//         callback(errorMsg);
//       }
//     }
//   }

//   static *refreshToken() {
//     const refreshToken = yield select((state) => state['AUTH'].get('refreshToken'));
//     if (refreshToken) {
//       try {
//         const response = yield call(AuthService.refreshToken, refreshToken);
//         if (response.status === 200 && response.data.success) {
//           const token = response.data.data.access_token;
//           const expired = response.data.data.access_token_expires;
//           yield put(
//             AuthActions.refreshTokenCompleted({
//               token,
//               expired,
//             }),
//           );
//         }
//       } catch (error) {
//         const errorMsg = getAPIErrorMessage(error);
//         yield put({
//           type: AuthActionTypes.REFRESH_TOKEN_FAILURE,
//           error: errorMsg,
//         });
//       }
//     } else {
//       yield put({
//         type: AuthActionTypes.REFRESH_TOKEN_FAILURE,
//         error: 'Refresh token not found',
//       });
//     }
//   }

//   static *watchVerifyEmail() {
//     yield takeLatest(AuthActionTypes.VERIFY_EMAIL_REQUEST, AuthSaga.verifyEmail);
//   }

//   static *watchVerifyPassword() {
//     yield takeLatest(AuthActionTypes.VERIFY_PASSWORD_REQUEST, AuthSaga.verifyPassword);
//   }

//   static *watchVerifyOTP() {
//     yield takeLatest(AuthActionTypes.VERIFY_OTP_REQUEST, AuthSaga.verifyOTP);
//   }

//   static *watchRefreshToken() {
//     yield takeLatest(AuthActionTypes.REFRESH_TOKEN_REQUEST, AuthSaga.refreshToken);
//   }

//   static *authFlow() {
//     yield all([
//       AuthSaga.watchVerifyEmail(),
//       AuthSaga.watchVerifyPassword(),
//       AuthSaga.watchVerifyOTP(),
//       AuthSaga.watchRefreshToken(),
//     ]);
//   }
// }

function *verifyEmail({ payload }) {
  try {
    const { email } = payload;
    const response = yield call(AuthService.verifyEmail, email);
    if (response.status === 200 && response.data.success) {
      yield put({
        type: AuthActionTypes.VERIFY_EMAIL_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: AuthActionTypes.VERIFY_EMAIL_FAILURE,
      error: getAPIErrorMessage(error),
    });
  }
}

function *verifyPassword({ payload }) {
  try {
    const {  password } = payload;
    const response = yield call(AuthService.verifyPassword, password);
    if (response.status === 200 && response.data.success) {
      yield put({
        type: AuthActionTypes.VERIFY_PASSWORD_SUCCESS,
        payload: {
          message: response.data.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: AuthActionTypes.VERIFY_PASSWORD_FAILURE,
      error: getAPIErrorMessage(error),
    });
  }
}

function *verifyOTP({ payload }) {
  const { otp, callback } = payload;
  try {
    const response = yield call(AuthService.verifyOTP, otp);
    if (response.status === 200 && response.data.success) {
      const userId = response.data.data.user_id;
      const token = response.data.data.access_token;
      const expired = response.data.data.access_token_expires;
      const refreshToken = response.data.data.refresh_token;
      const fullName = response.data.data.full_name;
      const avatarUrl = response.data.data.avatar_url;

      yield put(
        AuthActions.verifyOTPCompleted({
          userId,
          token,
          expired,
          refreshToken,
          fullName,
          avatarUrl,
        }),
      );
    }
    if (callback && isFunction(callback)) {
      callback();
    }
  } catch (error) {
    const errorMsg = getAPIErrorMessage(error);
    yield put({
      type: AuthActionTypes.VERIFY_OTP_FAILURE,
      error: errorMsg,
    });
    if (callback && isFunction(callback)) {
      callback(errorMsg);
    }
  }
}

function *refreshToken() {
  const refreshToken = yield select((state) => state['AUTH'].get('refreshToken'));
  if (refreshToken) {
    try {
      const response = yield call(AuthService.refreshToken, refreshToken);
      if (response.status === 200 && response.data.success) {
        const token = response.data.data.access_token;
        const expired = response.data.data.access_token_expires;
        yield put(
          AuthActions.refreshTokenCompleted({
            token,
            expired,
          }),
        );
      }
    } catch (error) {
      const errorMsg = getAPIErrorMessage(error);
      yield put({
        type: AuthActionTypes.REFRESH_TOKEN_FAILURE,
        error: errorMsg,
      });
    }
  } else {
    yield put({
      type: AuthActionTypes.REFRESH_TOKEN_FAILURE,
      error: 'Refresh token not found',
    });
  }
}

function *watchVerifyEmail() {
  yield takeLatest(AuthActionTypes.VERIFY_EMAIL_REQUEST, verifyEmail);
}

function *watchVerifyPassword() {
  yield takeLatest(AuthActionTypes.VERIFY_PASSWORD_REQUEST, verifyPassword);
}

function *watchVerifyOTP() {
  yield takeLatest(AuthActionTypes.VERIFY_OTP_REQUEST, verifyOTP);
}

function *watchRefreshToken() {
  yield takeLatest(AuthActionTypes.REFRESH_TOKEN_REQUEST, refreshToken);
}

// function *authFlow() {
//   yield all([
//     watchVerifyEmail(),
//     watchVerifyPassword(),
//     watchVerifyOTP(),
//     watchRefreshToken(),
//   ]);
// }

export default function* authRoot() {
  yield all([
    watchVerifyEmail(),
    watchVerifyPassword(),
    watchVerifyOTP(),
    watchRefreshToken(),
  ]);
}