import { call, put, takeLatest, all, fork, take, cancel } from 'redux-saga/effects';
import { Types, Creators } from '../../actions/recommendedStrategies';
import { getStrategies as getStrategiesApi } from '../../../axios/recommendedStratgies';

const delay = time => new Promise(resolve => setTimeout(resolve, time));

function* getStrategyRequest() {
  try {
    yield call(delay, 2000);
    const apiTable =  yield call(getStrategiesApi);

    yield put(Creators.getStrategySuccess({
      recommendedStrategiesData: apiTable,
    }));

  } catch (error) {
    yield put(Creators.getStrategyError({ error }));
  }
}

function* watchGetStrategies() {
  yield takeLatest(Types.GET_STRATEGY_REQUEST, getStrategyRequest);
}

export default function* recommendedRoot() {
  if (Types.INIT_CONTAINER) {
    while (yield take(Types.INIT_CONTAINER)) {
      const backgroundTasks = yield all([
        fork(watchGetStrategies),
      ]);

      if (Types.DESTROY_CONTAINER) yield take(Types.DESTROY_CONTAINER);
      yield cancel(backgroundTasks);
    }
  }
}